using EMS.API.DTOs;
using EMS.API.Model;
using EMS.API.Services;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMS.Tests.Controllers
{
    [TestFixture]
    public class EmployeesControllerTests
    {
        private Mock<IEmployeeRepository> _repoMock;
        private EmployeeService _service;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IEmployeeRepository>();
            _service = new EmployeeService(_repoMock.Object);
        }

        // ✅ GET BY ID - SUCCESS
        [Test]
        public async Task GetByIdAsync_ValidId_ReturnsDto()
        {
            var emp = new Employee { Id = 1, FirstName = "A", Email = "a@test.com" };

            _repoMock.Setup(r => r.GetByIdAsync(1))
                     .ReturnsAsync(emp);

            var result = await _service.GetByIdAsync(1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Id, Is.EqualTo(1));
        }

        // ❌ GET BY ID - NOT FOUND
        [Test]
        public async Task GetByIdAsync_InvalidId_ReturnsNull()
        {
            _repoMock.Setup(r => r.GetByIdAsync(1))
                     .ReturnsAsync((Employee?)null);

            var result = await _service.GetByIdAsync(1);

            Assert.That(result, Is.Null);
        }

        // ✅ CREATE SUCCESS
        [Test]
        public async Task CreateAsync_Valid_AddsEmployee()
        {
            var dto = new EmployeeRequestDto { Email = "a@test.com" };

            _repoMock.Setup(r => r.EmailExistsAsync(dto.Email, null))
                     .ReturnsAsync(false);

            var result = await _service.CreateAsync(dto);

            _repoMock.Verify(r => r.AddAsync(It.IsAny<Employee>()), Times.Once);
            Assert.That(result.Email, Is.EqualTo(dto.Email));
        }

        // ❌ CREATE DUPLICATE EMAIL
        [Test]
        public void CreateAsync_EmailExists_ThrowsException()
        {
            var dto = new EmployeeRequestDto { Email = "a@test.com" };

            _repoMock.Setup(r => r.EmailExistsAsync(dto.Email, null))
                     .ReturnsAsync(true);

            Assert.ThrowsAsync<BadHttpRequestException>(() =>
                _service.CreateAsync(dto));
        }

        // ✅ UPDATE SUCCESS
        [Test]
        public async Task UpdateAsync_Valid_UpdatesEmployee()
        {
            var emp = new Employee { Id = 1, Email = "old@test.com" };
            var dto = new EmployeeRequestDto { Email = "new@test.com" };

            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(emp);
            _repoMock.Setup(r => r.EmailExistsAsync(dto.Email, 1)).ReturnsAsync(false);

            var result = await _service.UpdateAsync(1, dto);

            _repoMock.Verify(r => r.UpdateAsync(emp), Times.Once);
            Assert.That(result.Email, Is.EqualTo(dto.Email));
        }

        // ❌ UPDATE NOT FOUND
        [Test]
        public void UpdateAsync_NotFound_ThrowsException()
        {
            _repoMock.Setup(r => r.GetByIdAsync(1))
                     .ReturnsAsync((Employee?)null);

            Assert.ThrowsAsync<NotFoundException>(() =>
                _service.UpdateAsync(1, new EmployeeRequestDto()));
        }

        // ❌ UPDATE DUPLICATE EMAIL
        [Test]
        public void UpdateAsync_EmailExists_ThrowsException()
        {
            var emp = new Employee { Id = 1 };
            var dto = new EmployeeRequestDto { Email = "dup@test.com" };

            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(emp);
            _repoMock.Setup(r => r.EmailExistsAsync(dto.Email, 1)).ReturnsAsync(true);

            Assert.ThrowsAsync<BadHttpRequestException>(() =>
                _service.UpdateAsync(1, dto));
        }

        // ✅ DELETE SUCCESS
        [Test]
        public async Task DeleteAsync_Valid_CallsDelete()
        {
            var emp = new Employee { Id = 1 };

            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(emp);

            await _service.DeleteAsync(1);

            _repoMock.Verify(r => r.DeleteAsync(emp), Times.Once);
        }

        // ❌ DELETE NOT FOUND
        [Test]
        public void DeleteAsync_NotFound_ThrowsException()
        {
            _repoMock.Setup(r => r.GetByIdAsync(1))
                     .ReturnsAsync((Employee?)null);

            Assert.ThrowsAsync<NotFoundException>(() =>
                _service.DeleteAsync(1));
        }
    }
}