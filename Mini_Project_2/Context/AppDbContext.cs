
using EMS.API.Model;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Ensure Salary column has sufficient precision/scale to avoid silent truncation.
        modelBuilder.Entity<Employee>()
            .Property(e => e.Salary)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Employee>().HasData(
            
            new Employee { Id = 3, FirstName = "Neha", LastName = "Kapoor", Email = "neha.kapoor@gmail.com", Phone = "9988776655", Department = "HR", Designation = "HR Executive", Salary = 550000, JoinDate = new DateTime(2019, 11, 20), Status = "Active" },
            new Employee { Id = 4, FirstName = "Akash", LastName = "Verma", Email = "Akash.verma@gmail.com", Phone = "9011223344", Department = "Finance", Designation = "Financial Analyst", Salary = 720000, JoinDate = new DateTime(2022, 1, 10), Status = "Active" },
            new Employee { Id = 5, FirstName = "Sneha", LastName = "Prasad", Email = "sneha.prasad@gmail.com", Phone = "9876501234", Department = "Operations", Designation = "Operations Manager", Salary = 950000, JoinDate = new DateTime(2018, 6, 5), Status = "Active" },
            new Employee { Id = 6, FirstName = "Vikram", LastName = "Nair", Email = "vikram.nair@gmail.com", Phone = "9654321870", Department = "Engineering", Designation = "Senior Developer", Salary = 1100000, JoinDate = new DateTime(2017, 9, 12), Status = "Active" },
            new Employee { Id = 7, FirstName = "Ananya", LastName = "Singh", Email = "ananya.singh@gmail.com", Phone = "9345678901", Department = "Marketing", Designation = "Content Strategist", Salary = 580000, JoinDate = new DateTime(2023, 2, 28), Status = "Inactive" },
            new Employee { Id = 8, FirstName = "Karthik", LastName = "Rajan", Email = "karthik.rajan@gmail.com", Phone = "9812345670", Department = "Finance", Designation = "Accounts Manager", Salary = 800000, JoinDate = new DateTime(2020, 4, 17), Status = "Active" },
            new Employee { Id = 9, FirstName = "Divya", LastName = "Kumar", Email = "divya.kumar@gmail.com", Phone = "9701234568", Department = "HR", Designation = "Talent Acquisition Lead", Salary = 690000, JoinDate = new DateTime(2021, 8, 22), Status = "Active" },
            new Employee { Id = 10, FirstName = "Meera", LastName = "Krishnan", Email = "meera.krishnan@gmail.com", Phone = "9567890123", Department = "Engineering", Designation = "QA Engineer", Salary = 730000, JoinDate = new DateTime(2022, 11, 3), Status = "Active" },
            new Employee { Id = 11, FirstName = "Suresh", LastName = "Babu", Email = "suresh.babu@gmail.com", Phone = "9234567891", Department = "Finance", Designation = "Tax Consultant", Salary = 670000, JoinDate = new DateTime(2019, 5, 14), Status = "Inactive" },
            new Employee { Id = 12, FirstName = "Lakshmi", LastName = "Chandran", Email = "lakshmi.chandran@gmail.com", Phone = "9890123457", Department = "Marketing", Designation = "Brand Manager", Salary = 880000, JoinDate = new DateTime(2020, 12, 9), Status = "Active" },
            new Employee { Id = 13, FirstName = "Amit", LastName = "Joshi", Email = "amit.joshi@gmail.com", Phone = "9456789013", Department = "Operations", Designation = "Supply Chain Analyst", Salary = 610000, JoinDate = new DateTime(2023, 6, 19), Status = "Active" },
            new Employee { Id = 14, FirstName = "Pooja", LastName = "Ghosh", Email = "pooja.ghosh@gmail.com", Phone = "9678901236", Department = "Engineering", Designation = "DevOps Engineer", Salary = 920000, JoinDate = new DateTime(2021, 9, 30), Status = "Active" },
            new Employee { Id = 15, FirstName = "Rajesh", LastName = "Menon", Email = "rajesh.menon@gmail.com", Phone = "9123789456", Department = "Operations", Designation = "Logistics Coordinator", Salary = 540000, JoinDate = new DateTime(2018, 3, 25), Status = "Inactive" }
        );
    }
}