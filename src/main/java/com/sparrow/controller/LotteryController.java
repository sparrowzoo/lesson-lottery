package com.sparrow.controller;

import com.sparrow.controller.vo.Award;
import com.sparrow.controller.vo.LotteryResult;
import com.sparrow.protocol.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class LotteryController {
    @GetMapping("health")
    public String health() {
        return "ok";
    }

    @PostMapping("awards")
    public Result<List<Award>> getAllAwards() {
        List<Award> awards = this.awardList();
        return new Result<>(awards);
    }

    private List<Award> awardList() {
        List<Award> awards = new ArrayList<>();
        awards.add(new Award(1L, "5000元京东卡", "images/1.png", 3F));
        awards.add(new Award(2L, "1000元京东卡", "images/2.png", 5F));
        awards.add(new Award(3L, "100个比特币", "images/3.png", 2F));
        awards.add(new Award(4L, "50元话费", "images/4.png", 49F));
        awards.add(new Award(5L, "100元话费", "images/5.png", 30F));
        awards.add(new Award(6L, "500个比特币", "images/6.png", 1F));
        awards.add(new Award(7L, "500元京东卡", "images/7.png", 10F));
        return awards;
    }

    /**
     * 产生随机数 0~100之间
     * 根据奖品的概率 返回相应的中奖奖品
     * 具体流程如下：
     * 如果 随机数在0~15(15%)之间， 则国家A中奖 随机数>=0 and 随机数<15     15%  15%
     * 如果 随机数在15~35(20%)之间，则国家B中奖 随机数>=15 and 随机数<35    20%  35%=15%+20%
     * 如果随机数在 35~45(10%)之间，则国家C中奖                           10%  45%=15%+20%+10%
     * 依此类推
     * <p>
     * 优点：方便初学者理解
     * 缺点：
     * 1. 不具扩展性
     * 2. 随着奖品的增多，代码的可读性会毕竟差
     *
     * @return
     */
    public LotteryResult lotteryV1() {
        List<Award> list = this.awardList();
        double percent = Math.random() * 100;
        if (percent < list.get(0).getPercent()) {
            return new LotteryResult(0, list.get(0));
        }
        if (percent < list.get(1).getPercent() + list.get(0).getPercent()) {
            return new LotteryResult(1, list.get(1));
        }
        if (percent < list.get(2).getPercent() + list.get(1).getPercent() + list.get(0).getPercent()) {
            return new LotteryResult(2, list.get(2));
        }
        //todo 自行完成
        return null;
    }

    @PostMapping("lottery")
    public Result<LotteryResult> lotteryV2() {
        List<Award> list = this.awardList();
        double percent = Math.random() * 100;
        double totalPercent = 0;
        for (int i = 0, length = list.size(); i < length; i++) {
            totalPercent += list.get(i).getPercent();
            //i=0,totalPercent=15%
            //i=totalPercent=totalPercent(15%)+20%=35%
            if (percent <= totalPercent) {
                return new Result<>(new LotteryResult(i, list.get(i)));
            }
        }
        return Result.fail();
    }
}
