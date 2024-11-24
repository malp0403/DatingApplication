using System;
using API.DTOs;
using API.entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public async Task<MemberDto?> GetMemberDtoByIdAsync(int id)
    {
        return await context.Users.Where(x=>x.Id == id).ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetMemberDtosAsync()
    {
        return await context.Users.ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await context.Users.Include(x => x.Photos).Where(x => x.Id == id).FirstOrDefaultAsync();

    }

    public async Task<MemberDto?> GetMemberDtoByUsernameAsync(string username)
    {
        return await context.Users.Where(x=>x.UserName == username).ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users.Include(x => x.Photos).Where(x => x.UserName == username).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<AppUser>> GetusersAsync()
    {
        return await context.Users
        .Include(x => x.Photos)
        .ToListAsync();

    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }
}
