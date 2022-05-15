<template>
  <div class="container px-4 py-5">
    <h2 class="pb-2 border-bottom">사용법 안내</h2>
    <div class="row row-cols-1 row-cols-lg-2 align-items-stretch g-4 py-5">
      <div class="col">
        <div class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg">
          <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
            <h2 class="mb-4 display-6 lh-1 fw-bold">1. 위치</h2>
            <p class="fs-5">위치를 선택해주세요.</p>
            <p class="fs-6 mb-4 text-secondary">(아이폰 사파리는 지원되지 않습니다...)</p>
            <button class="btn btn-secondary" @click="location">현재 위치</button>
            <button class="btn btn-primary mt-1" @click="execDaumPostcode">주소검색</button>
            <ul class="d-flex list-unstyled mt-auto text-secondary">
              <li class="me-auto">
              </li>
              <li class="d-flex align-items-center me-3">
                <svg class="bi me-2" width="1em" height="1em"><use xlink:href="#geo-fill"/></svg>
                <small>lat : {{center.lat}}</small>
              </li>
              <li class="d-flex align-items-center">
                <svg class="bi me-2" width="1em" height="1em"><use xlink:href="#calendar3"/></svg>
                <small>lng : {{center.lng}}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg">
          <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
            <h2 class="mb-4 display-6 lh-1 fw-bold">2. 검색</h2>
            <p class="fs-5">검색어를 입력해주세요.</p>
            <div class="col-md-12"><input class="form-control text-center" type="text" id="keyword" v-on:keyup.enter="makeMarkersSelect" placeholder="ex) 대학교, 병원, 중국집, 한식 ..."/></div>
            <div class="col-md-12 mt-1 mb-1"><input class="form-control text-center" type="number" v-on:keyup.enter="makeMarkersSelect" id="radius" placeholder="거리 입력 (m기준 / 기본 500m 반경, 최대 50,000m 검색)"/></div>
            <button class="btn btn-primary" @click="makeMarkersSelect">뽑기</button>
            <ul class="d-flex list-unstyled mt-auto">
              <li class="me-auto">
              </li>
              <li class="d-flex align-items-center me-3">
                <svg class="bi me-2" width="1em" height="1em"><use xlink:href="#geo-fill"/></svg>
              </li>
              <li class="d-flex align-items-center">
                <svg class="bi me-2" width="1em" height="1em"><use xlink:href="#calendar3"/></svg>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row row-cols-1 row-cols-lg-1 align-items-stretch">
      <div class="col">
        <div class="card card-cover h-100 overflow-hidden rounded-5 shadow-lg">
          <div class="d-flex flex-column h-100  text-shadow-1">
            <GMapMap id="googleMap" :center="center" :zoom="16" style="width: 100%; height: 500px">
              <GMapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="false" @click="openMarker(m.idx)">
                <GMapInfoWindow :opened="openedMarkerID === m.idx">
                  <div class="card">
                    <div class="card-header">
                      영업 상태 : {{m.opennow}}
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">{{m.name}}</h5>
                      <p class="card-text">
                        평점 : {{m.rating}} (총 리뷰 {{m.userRatingsTotal}} 건)
                      </p>
                      <p class="card-text">
                        가격대 : {{m.priceLevel}}
                      </p>
                      <p class="card-text">
                        <b>{{m.name}}</b>{{m.content}}
                      </p>
                      <button type="button" class="btn btn-secondary" @click="test">버튼</button>
                    </div>
                  </div>
                </GMapInfoWindow>
              </GMapMarker>
            </GMapMap>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="fullPage"/>
</template>

<script>
import axios from "axios";
import jayeon from "@/axios/jayeon-axios";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import router from '@/router';

export default {
  name: 'EatsComponent',
  props: {
    msg: String
  },
  components: { Loading },
  data() {
    const center = {lat: 37.382314, lng: 127.119613};
    const markers = [];
    return {center, markers, isLoading: false, fullPage: true, openedMarkerID : null};
  },
  methods:{
    //지도 출력
    location(){
        if(!navigator.geolocation) {
            const msg = '위치 정보가 지원되지 않습니다.';
            alert(msg);
            throw msg;
        }
        navigator.geolocation.getCurrentPosition(position => {
            this.center = {
              lat : position.coords.latitude,
              lng : position.coords.longitude
            }
        });
    },
    //다음 주소 검색
    execDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.kakaoAddress(data.address);
        },
      }).open();
    },
    //주소를 기준으로 위도, 경도 정보 가져오기
    kakaoAddress(address){
      axios.get('https://dapi.kakao.com/v2/local/search/address',{
        params:{
          query: address
        },
        headers:{
          Authorization : 'KakaoAK '+ process.env.VUE_APP_KAKAO_REST_API_KEY
        }
      })
      .then(res=>{
        const roadAddress = res.data.documents[0].address;
        this.setCenter(roadAddress.x,roadAddress.y);
      })
      .catch(err=>{
        alert('주소를 불러오는데 실패했습니다...');
        console.log(err);
      });
    },
    //지도 위치 변경
    setCenter(x, y){
      const xx = Number(x);
      const yy = Number(y);
      this.center = {
        lat : yy,
        lng : xx
      }
    },
    //지도에 마크 찍어내기
    async makeMarkers(){
      const keyword = document.getElementById('keyword').value;
      const radius = document.getElementById('radius').value;
      if(keyword == ''){
        alert('키워드는 필수값입니다!');
        return;
      }

      const data = {
        lat : this.center.lat,
        lng : this.center.lng,
        keyword : keyword,
        radius : radius,
      }
      await jayeon.post('/google/places',data)
      .then(async res =>{
        const result = res.data;
        if(result.status == 'ZERO_RESULTS'){
          alert('일치하는 결과가 존재하지 않습니다!');
          return;
        }
        const markers = [];
        const range = result.results.length;
        const random = Math.floor( ( Math.random() * range ));

        await result.results.forEach((r, index) => {
          let opennow = '알 수 없음';
          if(typeof r.opening_hours != 'undefined') opennow = r.opening_hours.open_now == true ? '열림':'닫힘';

          let priceLevel = '매우 저렴';
          if(typeof r.price_level != 'undefined'){
            priceLevel = r.price_level == 1 ? '매우 저렴' :
              r.price_level == 2 ? '저렴' :
              r.price_level == 3 ? '보통' :
              r.price_level == 4 ? '비쌈' : 
              r.price_level == 5 ? '매우 비쌈' : '알 수 없음';
          }
          const marker = {
            idx : index,
            position : r.geometry.location, 
            label: r.name.substring(0,1),
            title: r.name, 
            opennow: opennow, 
            name: r.name, 
            content: r.vicinity, 
            rating : r.rating, 
            userRatingsTotal : r.user_ratings_total,
            priceLevel : priceLevel,
          };
          markers.push(marker);
        });
        this.openMarker(random);
        this.markers = markers;
      })
      .catch(err=>{
        alert('알 수 없는 오류 발생');
        console.err(err);
      });
    },
    //바로 뽑기
    async makeMarkersSelect(){
      this.isLoading = true;
      await this.makeMarkers();
      this.isLoading = false;
    },
    //marker open infoWindow
    openMarker(idx){
      this.openedMarkerID = idx;
    },
    //로그인 후 사용할 수 있는 기능 테스트
    test(){
      jayeon.get('/member/tokenCheck')
      .then(res => {
        console.log(res);
        if(res.status == '200'){
            alert('정상실행');
        }
      })
      .catch((err) => {
        if(err.response.status == 401){
          alert('로그인 후 다시 시도해 주세요.');
          router.push({name:'login'});
        }
        console.log(err);
      })
    },
  },
  
  
  beforeMount(){
    this.location();
  },
}
</script>