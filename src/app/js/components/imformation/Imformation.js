import React, { Component } from 'react';
import { Pagination } from 'antd';

export default class Imformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
          current: 1,
          pageSize: 10,
          showIndex: 0,
          rotate: 0,
        }
    }

    getCurrData() {
      return DATA.slice((this.state.current-1)*this.state.pageSize, this.state.current*this.state.pageSize);
    }

    changePage(value) {
        this.setState({
            current: value,
        });
    }

    createItem() {
        var list = [];
        var data = this.getCurrData();
        data.map((obj, idx) => {
            list.push(
                <div key={idx} className="imformation-item clearfix">
                    <div className="imformation-img">
                        <img src={obj.img} />
                    </div>
                    <div className="information-con">
                        <h3 className="imformation-title"><a href="javascript:;">{obj.title}</a></h3>
                        <p className="imformation-text">{obj.content}</p>
                        <div className="imformation-other">
                            <span>{'['+obj.type+']'}</span>
                            <span>{obj.time}</span>
                            <span>{'浏览数 '+obj.viewNum}</span>
                        </div>
                    </div>
                </div>
            );
        });
        return list;
    }

    changeIndex(idx) {
        console.log(360/INDUSTRY_DATA.length*idx);
        this.setState({
            showIndex: idx,
            // rotate: 360-360/INDUSTRY_DATA.length*(idx),
        })
    }

    createAxis() {
        var list = [];
        var pos = this.computePos(INDUSTRY_DATA.length, 0);//改为零 动画改回this.state.showIndex
        INDUSTRY_DATA.map((key, idx) => {
            var classStr = this.state.showIndex == idx ? "imformation-axis active" : "imformation-axis";
            list.push(
                <div onClick={this.changeIndex.bind(this, idx)} key={key} style={{left:pos[idx].left, top:pos[idx].top, transform: 'rotate('+-this.state.rotate+'deg)'}} className={classStr}>
                    {key}
                </div>
            )
        })
        return list;
    }

    computePos(num, index) {
        var countArr = [];
        var posArr = [];
        var tag1 = 0;
        var tag2 = num-1;
        for(var i=index;i<num;i++) {
            countArr[i]=tag1;
            tag1++;
        }
        for(var i=index-1;i>=0; i--) {
            countArr[i]=tag2;
            tag2--;
        }
        var PI  = Math.PI;
        countArr.map((key) => {
            var obj = {};
            obj.left = Math.cos(key*PI/180*(360/num)).toFixed(5)*70 + 47;
            obj.top = Math.sin(key*PI/180*(360/num)).toFixed(5)*70 + 54;
            posArr.push(obj);
        })
        return posArr;
    }

    createNews() {
        var list = [];
        var data = this.getCurrData();
        data.map((obj, idx) => {
            list.push(
                <div key={idx}>
                    <a className="news-title" href="javascript:;">{'['+obj.title+']'}</a>
                </div>
            );
        });
        return list;
    }

    render() {
        return (
            <div className="imformation-wrap">
                <div className="imformation clearfix">
                    <div className="imformation-left">
                        <div className="imformation-left-con">
                            <h1 className='imformation-left-tit'>公司新闻</h1>
                            <div>
                                {this.createNews()}
                            </div>
                        </div>
                        <div className="imformation-left-con">
                            <h1 className='imformation-left-tit'>行业新闻</h1>
                            <div>
                                {this.createNews()}
                            </div>
                        </div>
                        <div className="imformation-left-axis">
                            <div style={{transform: 'rotate('+this.state.rotate+'deg)'}} className="imformation-circle">
                                {this.createAxis()}
                            </div>
                        </div>
                    </div>
                    <div className="imformation-right">
                        {this.createItem()}
                        <div className="imformation-pagination">
                            <Pagination current={this.state.current}
                                pageSize={this.state.pageSize}
                                defaultCurrent={1}
                                total={DATA.length}
                                onChange={this.changePage.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
var INDUSTRY_DATA = ['公司', '行业', '国际', '国外'];
var DATA = [
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_1.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_2.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_3.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_4.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_1.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_2.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_3.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_4.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_1.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_2.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_3.jpg'},
  {title: '中广测创新红木鉴定技术 解决种', type: '行业新闻', viewNum: 1, time: '2016-05-05', content: '如今，购买红木家具的家庭多了起来，但是市场上五花八门的木材让普通消费者一时难以辨别。以次充好、假冒伪劣的红木家具不仅扰乱了市场秩序，也影响了整个红木行业的信誉',img: '/imformation/item_4.jpg'},
];
