using System;
using System.Linq.Expressions;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{

    public static string GetUsername(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if(username == null) throw new Exception("Cannot get username from token");

        return username;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.Name);
        if (username == null) throw new Exception("Cannot get username from token");

        return int.Parse(username);
    }
}
