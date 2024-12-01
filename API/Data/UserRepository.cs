using System;
using API.DTOs;
using API.entities;
using API.Helpers;
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

    public async Task<PagedList<MemberDto>> GetMemberDtosAsync(UserParams userParams)
    {
        var test = context.Users.ToList();
       var query = context.Users.AsQueryable();
        query = query.Where(x => x.UserName != userParams.CurrentUsername);
        if(userParams.Gender != null)
        {
            query = query.Where(x => x.Gender == userParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = userParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider), userParams.PageNumber,userParams.PageSize);
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
