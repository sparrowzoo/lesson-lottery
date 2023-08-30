package com.sparrow.controller.vo;

public class Award {
    public Award(Long id, String name, String image, Float percent) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.percent = percent;
    }

    /**
     * 奖品ID
     */
    private Long id;
    /**
     * 奖品名称
     */
    private String name;
    /**
     * 奖品图片
     */
    private String image;
    /**
     * 奖品百分比
     */
    private Float percent;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public Float getPercent() {
        return percent;
    }
}
