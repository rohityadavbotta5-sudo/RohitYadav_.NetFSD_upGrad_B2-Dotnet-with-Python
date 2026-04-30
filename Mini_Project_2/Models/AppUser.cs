using System.ComponentModel.DataAnnotations;

namespace EMS.API.Model
{
    public class AppUser
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = "";

        [Required]
        public string PasswordHash { get; set; } = "";

        public string Role { get; set; } = "Viewer";
    }
}
