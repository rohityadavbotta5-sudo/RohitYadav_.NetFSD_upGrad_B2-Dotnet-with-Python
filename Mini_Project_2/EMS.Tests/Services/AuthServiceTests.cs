using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Model;
using EMS.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;   

        namespace EMS.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests
    {
        private DbContextOptions<AppDbContext> CreateNewContextOptions()
        {
            // use the in-memory provider type name to avoid requiring a package in tests compile-time
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            builder.UseInMemoryDatabase(Guid.NewGuid().ToString());
            return builder.Options;
        }

        private IConfiguration CreateConfiguration()
        {
            var inMemorySettings = new Dictionary<string, string?>
    {
        { "Jwt:Key", "test_key_which_is_long_enough_123456" },
        { "Jwt:Issuer", "test_issuer" },
        { "Jwt:Audience", "test_audience" }
    };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();
        }

        [Test]
        public async Task RegisterAsync_WhenUsernameExists_ReturnsFailure()
        {
            var options = CreateNewContextOptions();

            using (var db = new AppDbContext(options))
            {
                db.AppUsers.Add(new AppUser { Username = "existing", PasswordHash = BCrypt.Net.BCrypt.HashPassword("pass") });
                await db.SaveChangesAsync();
            }

            using (var db = new AppDbContext(options))
            {
                var svc = new AuthService(db, CreateConfiguration());

                var dto = new RegisterRequestDto { Username = "existing", Password = "whatever" };
                var res = await svc.RegisterAsync(dto);

                Assert.That(res.Success, Is.False);
                Assert.That(res.Message, Does.Contain("exists").IgnoreCase);
            }
        }

        [Test]
        public async Task RegisterAsync_NewUser_CreatesUserAndReturnsSuccess()
        {
            var options = CreateNewContextOptions();

            using (var db = new AppDbContext(options))
            {
                var svc = new AuthService(db, CreateConfiguration());

                var dto = new RegisterRequestDto { Username = "newuser", Password = "pw", Role = "Admin" };
                var res = await svc.RegisterAsync(dto);

                Assert.That(res.Success, Is.True);
                Assert.That(res.Username, Is.EqualTo("newuser"));
                Assert.That(res.Role, Is.EqualTo("Admin"));
                Assert.That(res.Token, Is.Not.Null.And.Not.Empty);

                var created = db.AppUsers.SingleOrDefault(u => u.Username == "newuser");
                Assert.That(created, Is.Not.Null);
                Assert.That(created!.Role, Is.EqualTo("Admin"));
            }
        }

        [Test]
        public async Task LoginAsync_InvalidCredentials_ReturnsFailure()
        {
            var options = CreateNewContextOptions();

            using (var db = new AppDbContext(options))
            {
                db.AppUsers.Add(new AppUser { Username = "bob", PasswordHash = BCrypt.Net.BCrypt.HashPassword("correct") });
                await db.SaveChangesAsync();
            }

            using (var db = new AppDbContext(options))
            {
                var svc = new AuthService(db, CreateConfiguration());

                var dto = new AuthRequestDto { Username = "bob", Password = "wrong" };
                var res = await svc.LoginAsync(dto);

                Assert.That(res.Success, Is.False);
                Assert.That(res.Message, Does.Contain("Invalid").IgnoreCase);
            }
        }

        [Test]
        public async Task LoginAsync_ValidCredentials_ReturnsSuccessAndToken()
        {
            var options = CreateNewContextOptions();

            using (var db = new AppDbContext(options))
            {
                db.AppUsers.Add(new AppUser { Username = "alice", PasswordHash = BCrypt.Net.BCrypt.HashPassword("secret"), Role = "Viewer" });
                await db.SaveChangesAsync();
            }

            using (var db = new AppDbContext(options))
            {
                var svc = new AuthService(db, CreateConfiguration());

                var dto = new AuthRequestDto { Username = "alice", Password = "secret" };
                var res = await svc.LoginAsync(dto);

                Assert.That(res.Success, Is.True);
                Assert.That(res.Username, Is.EqualTo("alice"));
                Assert.That(res.Role, Is.EqualTo("Viewer"));
                Assert.That(res.Token, Is.Not.Null.And.Not.Empty);
            }
        }
    }
}
