using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDto
{
    [Required]
    public string Username { get; set; }
    public string Password { get; set; }
}
