using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Employee_Management_System.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "Department", "Designation", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Salary", "Status" },
                values: new object[,]
                {
                    { 3, "HR", "HR Executive", "neha.kapoor@gmail.com", "Neha", new DateTime(2019, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kapoor", "9988776655", 550000m, "Active" },
                    { 4, "Finance", "Financial Analyst", "Akash.verma@gmail.com", "Akash", new DateTime(2022, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Verma", "9011223344", 720000m, "Active" },
                    { 5, "Operations", "Operations Manager", "sneha.prasad@gmail.com", "Sneha", new DateTime(2018, 6, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Prasad", "9876501234", 950000m, "Active" },
                    { 6, "Engineering", "Senior Developer", "vikram.nair@gmail.com", "Vikram", new DateTime(2017, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nair", "9654321870", 1100000m, "Active" },
                    { 7, "Marketing", "Content Strategist", "ananya.singh@gmail.com", "Ananya", new DateTime(2023, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Singh", "9345678901", 580000m, "Inactive" },
                    { 8, "Finance", "Accounts Manager", "karthik.rajan@gmail.com", "Karthik", new DateTime(2020, 4, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rajan", "9812345670", 800000m, "Active" },
                    { 9, "HR", "Talent Acquisition Lead", "divya.kumar@gmail.com", "Divya", new DateTime(2021, 8, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kumar", "9701234568", 690000m, "Active" },
                    { 10, "Engineering", "QA Engineer", "meera.krishnan@gmail.com", "Meera", new DateTime(2022, 11, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Krishnan", "9567890123", 730000m, "Active" },
                    { 11, "Finance", "Tax Consultant", "suresh.babu@gmail.com", "Suresh", new DateTime(2019, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Babu", "9234567891", 670000m, "Inactive" },
                    { 12, "Marketing", "Brand Manager", "lakshmi.chandran@gmail.com", "Lakshmi", new DateTime(2020, 12, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chandran", "9890123457", 880000m, "Active" },
                    { 13, "Operations", "Supply Chain Analyst", "amit.joshi@gmail.com", "Amit", new DateTime(2023, 6, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Joshi", "9456789013", 610000m, "Active" },
                    { 14, "Engineering", "DevOps Engineer", "pooja.ghosh@gmail.com", "Pooja", new DateTime(2021, 9, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ghosh", "9678901236", 920000m, "Active" },
                    { 15, "Operations", "Logistics Coordinator", "rajesh.menon@gmail.com", "Rajesh", new DateTime(2018, 3, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Menon", "9123789456", 540000m, "Inactive" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_Username",
                table: "AppUsers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
