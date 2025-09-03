package org.iclass.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieVsDto {
    private Long vsIdx;
    private Long movieVs1Id;
    private Long movieVs2Id;
    private Integer active;
}
