using System;
using API.entities;

namespace API.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}
