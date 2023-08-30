package com.sparrow.controller.vo;

public class LotteryResult {
    public LotteryResult(Integer index, Award award) {
        this.index = index;
        this.award = award;
    }

    private Integer index;
    private Award award;

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public Award getAward() {
        return award;
    }

    public void setAward(Award award) {
        this.award = award;
    }
}
