using System;
using API.DTOs;
using API.entities;

namespace API.Interfaces;

public interface IUserRepository
{
    public void Update(AppUser user);

    public Task<bool> SaveAllAsync();

    public Task<IEnumerable<AppUser>> GetusersAsync();
    public Task<AppUser?> GetUserByIdAsync(int id);
    public Task<AppUser?> GetUserByUsernameAsync(string username);

    public Task<IEnumerable<MemberDto>> GetMemberDtosAsync();

    public Task<MemberDto?> GetMemberDtoByIdAsync(int id);

    public Task<MemberDto?> GetMemberDtoByUsernameAsync(string username);

}
