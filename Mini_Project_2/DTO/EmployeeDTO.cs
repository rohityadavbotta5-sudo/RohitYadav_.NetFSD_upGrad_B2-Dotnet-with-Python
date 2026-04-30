using System.ComponentModel.DataAnnotations;

namespace EMS.API.DTOs;

public class EmployeeRequestDto
{
    [Required]
    public string FirstName { get; set; } = "";

    [Required]
    public string LastName { get; set; } = "";

    [Required, EmailAddress]
    public string Email { get; set; } = "";

    public string? Phone { get; set; }

    [Required]
    public string Department { get; set; } = "";

    public string? Designation { get; set; }

    public string Status { get; set; } = "Active";

    [Range(0, 999999999)]
    public decimal Salary { get; set; }
}

public class AuthRequestDto
{
    [Required]
    public string Username { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";
}

public class RegisterRequestDto
{
    [Required]
    public string Username { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";

    public string Role { get; set; } = "Viewer";
}

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string FullName => $"{FirstName} {LastName}";
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string? Department { get; set; }
    public string? Designation { get; set; }
    public string Status { get; set; } = "";
    public decimal Salary { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuthResponseDto
{
    public bool Success { get; set; }
    public string? Username { get; set; }
    public string? Role { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; }
}

public class DashboardSummaryDto
{
    public int TotalEmployees { get; set; }
    public int ActiveCount { get; set; }
    public int InactiveCount { get; set; }
    public int TotalDepartments { get; set; }
    public List<DepartmentCountDto> DepartmentBreakdown { get; set; } = [];
    public List<EmployeeResponseDto> RecentEmployees { get; set; } = [];
}

public class DepartmentCountDto
{
    public string Department { get; set; } = "";
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}

public class EmployeeQueryParams
{
    public string? Search { get; set; }
    public string? Department { get; set; }
    public string? Status { get; set; }
    public string? SortBy { get; set; } = "Name";
    public string SortDirection { get; set; } = "asc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}