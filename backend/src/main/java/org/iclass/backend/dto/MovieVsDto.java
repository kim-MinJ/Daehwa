package org.iclass.backend.dto;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Movie_VS")
public class MovieVsDto {
    private Long vsIdx;
    private Long movieVs1Id;
    private Long movieVs2Id;
    private Integer active;
}
