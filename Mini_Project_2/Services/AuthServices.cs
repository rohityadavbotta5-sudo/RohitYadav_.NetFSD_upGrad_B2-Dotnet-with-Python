using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EMS.API.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponseDto> LoginAsync(AuthRequestDto dto)
    {
        var user = await FindUserByUsernameAsync(dto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Invalid username or password."
            };
        }

        return new AuthResponseDto
        {
            Success = true,
            Username = user.Username,
            Role = user.Role,
            Token = GenerateToken(user),
            Message = "Login successful."
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        var exists = await UsernameExistsAsync(dto.Username);
        if (exists)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Username already exists."
            };
        }

        var user = new AppUser
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role
        };

        await AddUserAsync(user);
        await SaveChangesAsync();

        return new AuthResponseDto
        {
            Success = true,
            Username = user.Username,
            Role = user.Role,
            Token = GenerateToken(user),
            Message = "Registration successful."
        };
    }

    // Protected virtual methods to allow easier unit testing without EF provider.
    protected virtual Task<AppUser?> FindUserByUsernameAsync(string username)
        => _db.AppUsers.FirstOrDefaultAsync(u => u.Username == username);

    protected virtual Task<bool> UsernameExistsAsync(string username)
        => _db.AppUsers.AnyAsync(u => u.Username == username);

    protected virtual Task AddUserAsync(AppUser user)
    {
        _db.AppUsers.Add(user);
        return Task.CompletedTask;
    }

    protected virtual Task SaveChangesAsync()
        => _db.SaveChangesAsync();

    private string GenerateToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}