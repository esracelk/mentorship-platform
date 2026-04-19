package com.sau.mentorship.profile.alumni.mapper;

import com.sau.mentorship.profile.alumni.DTO.response.AlumniDetailResponseDTO;
import com.sau.mentorship.profile.alumni.DTO.response.AlumniListResponseDTO;
import com.sau.mentorship.profile.alumni.entity.AlumniProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AlumniMapper {

    @Mapping(target = "fullName", expression = "java(profile.getUser().getFirstName() + \" \" + profile.getUser().getLastName())")
    @Mapping(target = "skills", expression = "java(profile.getUser().getSkills().stream().map(skill -> skill.getName()).limit(4).toList())")
    AlumniListResponseDTO toDto(AlumniProfile profile);

    //burda alumni profile'dan user bilgilerine erişmek için mapping yapıyoruz
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "user.aboutMe", target = "aboutMe")
    AlumniDetailResponseDTO toAlumniDetailResponse(AlumniProfile alumni);
}
