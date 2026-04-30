using EMS.API.Model;
using EMS.API.Data;
using EMS.API.DTOs;
using Microsoft.EntityFrameworkCore;
using Employee_Management_System.Repository;

namespace EMS.API.Services;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _db;

    public EmployeeRepository(AppDbContext db) => _db = db;

    public async Task<Employee?> GetByIdAsync(int id)
        => await _db.Employees.FindAsync(id);

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        var query = _db.Employees.Where(e => e.Email.ToLower() == email.ToLower());
        if (excludeId.HasValue)
            query = query.Where(e => e.Id != excludeId.Value);

        return await query.AnyAsync();
    }

    public async Task AddAsync(Employee employee)
    {
        employee.JoinDate = DateTime.UtcNow;
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Employee employee)
    {
        _db.Employees.Update(employee);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Employee employee)
    {
        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();
    }

    public async Task<IEnumerable<Employee>> GetAllMatchingAsync(
        string? search, string? department, string? status,
        string sortBy, string sortDirection)
    {
        var query = _db.Employees.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(e =>
                ((e.FirstName ?? "") + " " + (e.LastName ?? "")).ToLower().Contains(s) ||
                (e.Email ?? "").ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(department))
            query = query.Where(e => (e.Department ?? "").ToLower() == department.ToLower());

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(e => (e.Status ?? "").ToLower() == status.ToLower());

        query = sortBy?.ToLower() switch
        {
            "salary" => sortDirection == "asc"
                ? query.OrderBy(e => e.Salary)
                : query.OrderByDescending(e => e.Salary),

            "joindate" => sortDirection == "asc"
                ? query.OrderBy(e => e.JoinDate)
                : query.OrderByDescending(e => e.JoinDate),

            _ => sortDirection == "asc"
                ? query.OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
                : query.OrderByDescending(e => e.LastName).ThenByDescending(e => e.FirstName)
        };

        return await query.ToListAsync();
    }

    public async Task<List<DashboardSummaryDto>> GetDashboardSummaryAsync()
    {
        var total = await _db.Employees.CountAsync();
        var active = await _db.Employees.CountAsync(e => e.Status == "Active");
        var inactive = await _db.Employees.CountAsync(e => e.Status == "Inactive");

        var departments = await _db.Employees
            .GroupBy(e => e.Department)
            .Select(g => new
            {
                Department = g.Key ?? "",
                Count = g.Count()
            })
            .OrderBy(x => x.Department)
            .ToListAsync();

        var totalDepartments = departments.Count;

        var depts = departments.Select(d => new DepartmentCountDto
        {
            Department = d.Department,
            Count = d.Count,
            Percentage = total > 0 ? Math.Round(100.0 * d.Count / total, 2) : 0
        }).ToList();

        var recent = await _db.Employees
            .OrderByDescending(e => e.JoinDate)
            .ThenByDescending(e => e.Id)
            .Take(5)
            .Select(e => new EmployeeResponseDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Department = e.Department,
                Designation = e.Designation,
                Status = e.Status ?? "",
                Salary = e.Salary,
                CreatedAt = e.JoinDate
            })
            .ToListAsync();

        return new List<DashboardSummaryDto>
        {
            new()
            {
                TotalEmployees = total,
                ActiveCount = active,
                InactiveCount = inactive,
                TotalDepartments = totalDepartments,
                DepartmentBreakdown = depts,
                RecentEmployees = recent
            }
        };
    }

    public IQueryable<Employee> GetQueryableAsync()
    {
        throw new NotImplementedException();
    }

    Task<IEnumerable<Employee>> IEmployeeRepository.GetAllMatchingAsync(string? search, string? department, string? status, string sortBy, string sortDirection)
    {
        return GetAllMatchingAsync(search, department, status, sortBy, sortDirection);
    }
}