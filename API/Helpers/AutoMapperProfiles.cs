using System;
using API.DTOs;
using API.entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
        .ForMember(d=>d.Age,o=>o.MapFrom(o=>o.DateOfBirth.CalculateAge()))
        .ForMember(d=>d.PhotoUrl,o=>o.MapFrom(s=>s.Photos.FirstOrDefault(x=>x.IsMain)!.Url));
        CreateMap<Photo, PhotoDto>();
    }
}
