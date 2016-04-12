import React, { Component } from 'react';

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="about-wrap">
              <div className="about">
                <h1 className="about-title">公司简介  Compant Profile</h1>
                <img className="about-logo" src="/about/about_bg.jpg" />
                <p>国风—互联网装修领导者（中国建筑装饰行业协会认证），国风由深圳市彬讯科技有限公司创办，总部位于深圳市南山区科技园，是国家级的高新技术企业。</p>
                <p>自2008年创办以来，国风始终秉承“用心服务用户来赢得口碑和利益”的经营理念，并始终处于高速而稳健的发展态势。截止目前，国风已开通250个城市分
                   站，汇聚全国近7万家正规装修公司、90万名室内设计师，已成立北京、上海、广州、武汉、长沙、南京、杭州、厦门、福州等26家分公司，当前拥有员工超过1500人。
　　                根据百度发布的一份报告显示，中国每天大约有300万人检索装修、家具、建材相关的信息，而国风平台当前每天有超过120万的独立用户，也就是说每3个中国人寻
                   找装修、家具、建材相关的信息，就有超过一个会通过国风平台来完成。2015年，国风获得了全球著名投资基金红杉资本、经纬创投等机构的C轮2亿美金投资，
                   这也是迄今为止，装修家居电子商务领域获得的一笔高额投资。</p>
                 <p>国风致力于让天下没有烦心的装修。为实现这个使命，全体国风人不断努力，推动装修、建材、家居市场的规范化，改变着数千万家庭的装修方式和置家理念，
                   为用户创造卓越的互联网装修体验。作为互联网装修企业，国风将通过O2O的模式，为传统装修及家居领域带来新的变革，不断为用户创造价值，推动行业发展。</p>
                 <p>打造开放、共赢的装修家居生态系统，推动行业更阳光、更透明。国风用实际行动获得众多的关注，相继受到央视网、光明网、新华网、凤凰网、第一财经周刊、2
                   1世纪商业评论、IT经理世界、36氪 等多家媒体的关注与报道。2011年国风和腾讯、华为一并入选《深圳质量报告》当作质量工程典范；2014年当选《中国企业家》主办的“未来之星”100强企业、荣膺“全国工商联家居电商专委会执行会长单位”、“中国互联网诚信示范企业”荣誉称号，同年还获得“21世纪中国最佳商业模式奖”。</p>
              </div>
            </div>
        )
    }
}
