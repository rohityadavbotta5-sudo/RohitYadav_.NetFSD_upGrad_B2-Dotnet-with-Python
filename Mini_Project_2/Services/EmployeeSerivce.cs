using Employee_Management_System.Repository;
using EMS.API.DTOs;
using EMS.API.Model;

namespace EMS.API.Services;

public class EmployeeService
{
    private readonly IEmployeeRepository _repo;

    public EmployeeService(IEmployeeRepository repo) => _repo = repo;

    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp == null) return null;

        return new EmployeeResponseDto
        {
            Id = emp.Id,
            FirstName = emp.FirstName,
            LastName = emp.LastName,
            Email = emp.Email,
            Phone = emp.Phone,
            Department = emp.Department,
            Designation = emp.Designation,
            Status = emp.Status ?? "",
            Salary = emp.Salary,
            CreatedAt = emp.JoinDate
        };
    }


    public async Task<EmployeeResponseDto> CreateAsync(EmployeeRequestDto dto)
    {
        if (await _repo.EmailExistsAsync(dto.Email))
            throw new BadHttpRequestException("Email already exists.", 409);

        var emp = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Department = dto.Department,
            Designation = dto.Designation,
            Status = dto.Status,
            Salary = dto.Salary
        };

        await _repo.AddAsync(emp);

        return new EmployeeResponseDto
        {
            Id = emp.Id,
            FirstName = emp.FirstName,
            LastName = emp.LastName,
            Email = emp.Email,
            Phone = emp.Phone,
            Department = emp.Department,
            Designation = emp.Designation,
            Status = emp.Status ?? "",
            Salary = emp.Salary,
            CreatedAt = emp.JoinDate
        };
    }

    public async Task<EmployeeResponseDto> UpdateAsync(int id, EmployeeRequestDto dto)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp == null) throw new NotFoundException("Employee not found.");

        if (await _repo.EmailExistsAsync(dto.Email, id))
            throw new BadHttpRequestException("Email already exists.", 409);

        emp.FirstName = dto.FirstName;
        emp.LastName = dto.LastName;
        emp.Email = dto.Email;
        emp.Phone = dto.Phone;
        emp.Department = dto.Department;
        emp.Designation = dto.Designation;
        emp.Status = dto.Status;
        emp.Salary = dto.Salary;

        await _repo.UpdateAsync(emp);

        return new EmployeeResponseDto
        {
            Id = emp.Id,
            FirstName = emp.FirstName,
            LastName = emp.LastName,
            Email = emp.Email,
            Phone = emp.Phone,
            Department = emp.Department,
            Designation = emp.Designation,
            Status = emp.Status ?? "",
            Salary = emp.Salary,
            CreatedAt = emp.JoinDate
        };
    }

    public async Task DeleteAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp == null) throw new NotFoundException("Employee not found.");

        await _repo.DeleteAsync(emp);
    }

    public async Task<PagedResult<EmployeeResponseDto>> GetAllAsync(EmployeeQueryParams qp)
    {
        if (qp.Page < 1) qp.Page = 1;
        if (qp.PageSize < 1) qp.PageSize = 10;
        if (qp.PageSize > 100) qp.PageSize = 100;

        var items = await _repo.GetAllMatchingAsync(
            qp.Search, qp.Department, qp.Status, qp.SortBy ?? "Name", qp.SortDirection);

        var total = items.Count();
        var pageItems = items
            .OrderBy(e => e.Id)
            .Skip((qp.Page - 1) * qp.PageSize)
            .Take(qp.PageSize)
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
            .ToList();

        return new PagedResult<EmployeeResponseDto>
        {
            Items = pageItems,
            Page = qp.Page,
            PageSize = qp.PageSize,
            TotalCount = total,
            TotalPages = (int)Math.Ceiling(total / (double)qp.PageSize)
        };
    }

    public async Task<List<DashboardSummaryDto>> GetDashboardSummaryAsync()
        => await _repo.GetDashboardSummaryAsync();
}

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}