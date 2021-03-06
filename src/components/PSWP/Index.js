/**
 * Created by Administrator on 2016/7/1.
 */
import React from 'react'
import PhotoSwipe from 'photoswipe';
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import configJson from 'configJson' ;
export default class ProductDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gallery: null,
        }

    }
    componentDidMount=()=>{
    }
    componentWillReceiveProps=(nextProps)=>{
        if(nextProps.imageIndex !==null && (this.props.imageIndex !== nextProps.imageIndex )){
            this.openGallery(nextProps.imageIndex)
        }
    }
    componentWillUnmount = () => {
        this.closeGallery();
    };
    closeGallery = () => {
        console.log('closeGallery')
        if (!this.gallery) return;
        this.props.setIndexNull()
        // this.gallery.destroy()
    };
    openGallery = (index) => {
        const options = {index: index,loop :true};
        const items = [];
        for(let i=0,len=this.props.data.length;i<len;i++){
            items.push({
                src: `${configJson.prefix}${this.props.data[i].image}`,
                w: 0,
                h: 0,
                title:this.props.data[i].content
            })
        }

        const pswpElement = this.pswpElement;
        this.gallery = new PhotoSwipe( pswpElement, PhotoswipeUIDefault, items, options);
        this.gallery.listen('gettingData', (index, item) => {
            const _this = this;
            if (item.w < 1 || item.h < 1) { // unknown size
                var img = new Image();
                img.onload = function() { // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    _this.gallery.invalidateCurrItems(); // reinit Items
                    _this.gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        this.gallery.listen('close', this.closeGallery);
        this.gallery.init();
    };
    render() {
        return (
            <div className="product-detail">
                <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true" ref={(div) => {this.pswpElement = div;} }>

                    <div className="pswp__bg" />
                    <div className="pswp__scroll-wrap">
                        <div className="pswp__container">
                            <div className="pswp__item" />
                            <div className="pswp__item" />
                            <div className="pswp__item" />
                        </div>

                        <div className="pswp__ui pswp__ui--hidden">

                            <div className="pswp__top-bar">

                                <div className="pswp__counter" />

                                <button className="pswp__button pswp__button--close" title="Close (Esc)" />

                                <button className="pswp__button pswp__button--fs" title="Toggle fullscreen" />

                                <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />

                                <div className="pswp__preloader">
                                    <div className="pswp__preloader__icn">
                                        <div className="pswp__preloader__cut">
                                            <div className="pswp__preloader__donut" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                                <div className="pswp__share-tooltip" />
                            </div>

                            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />

                            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />

                            <div className="pswp__caption">
                                <div className="pswp__caption__center" />
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }
}
