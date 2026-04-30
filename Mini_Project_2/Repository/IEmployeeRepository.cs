using EMS.API.DTOs;
using EMS.API.Model;

namespace Employee_Management_System.Repository
{
    public interface IEmployeeRepository
    {
        IQueryable<Employee> GetQueryableAsync();

        Task<Employee?> GetByIdAsync(int id);

        Task AddAsync(Employee employee);

        Task UpdateAsync(Employee employee);

        Task DeleteAsync(Employee employee);

        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<List<DashboardSummaryDto>> GetDashboardSummaryAsync();
        Task<IEnumerable<Employee>> GetAllMatchingAsync(string? search, string? department, string? status, string sortBy, string sortDirection);
    }
}
