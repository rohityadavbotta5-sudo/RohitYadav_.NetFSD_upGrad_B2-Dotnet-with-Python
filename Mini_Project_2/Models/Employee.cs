using System.ComponentModel.DataAnnotations;

namespace EMS.API.Model
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = "";

        [Required]
        public string LastName { get; set; } = "";

        [Required, EmailAddress]
        public string Email { get; set; } = "";

        public string? Phone { get; set; }
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public string Status { get; set; } = "Active";
        public decimal Salary { get; set; }
        public DateTime JoinDate { get; set; }
    }
}