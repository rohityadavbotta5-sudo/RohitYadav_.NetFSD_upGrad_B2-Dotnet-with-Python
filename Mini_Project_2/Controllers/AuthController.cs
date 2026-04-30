using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;

    public AuthController(AuthService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequestDto dto)
    {
        var result = await _service.LoginAsync(dto);
        if (!result.Success) return Unauthorized(result);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        var result = await _service.RegisterAsync(dto);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}