if(!self.define){let e,s={};const a=(a,r)=>(a=new URL(a+".js",r).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(r,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let f={};const b=e=>a(e,c),d={module:{uri:c},exports:f,require:b};s[c]=Promise.all(r.map((e=>d[e]||b(e)))).then((e=>(i(...e),f)))}}define(["./workbox-f407626e"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"assets/Angel-00-PznAhNcb.jpg",revision:"264ca3fe0cac3174d8b4891061cbc78e"},{url:"assets/Angel-01-EbMi_2-6.jpg",revision:"5081c74383851204b83367fdb8491fab"},{url:"assets/beacon_full-4i7LokvB.jpg",revision:"9f133b2652f7c384d8646f13a50f774c"},{url:"assets/beacon-Fs1PhYMK.jpg",revision:"dc2f2b4473af08cd5e5dd9ac6a1e9d55"},{url:"assets/Blackheart-00-Wq26GsNd.jpg",revision:"94e023d16e5fb9559899e79313d5b4ca"},{url:"assets/Blackheart-01-6lxmgBi9.jpg",revision:"56ac3d919eef178bba0628e06d2ef171"},{url:"assets/Brisket-00-H6Z-ZV4U.jpg",revision:"106f88cb50921bca5426abf2094c5cbd"},{url:"assets/Brisket-01-s9MimGgk.jpg",revision:"bf119bd3b2e24e35cc7fbed16f5f263b"},{url:"assets/brisket3-00-dzK3s2p-.jpg",revision:"909c52a5023b73f83605e0cb2b306198"},{url:"assets/brisket3-01-tfX2UPSJ.jpg",revision:"0eba3fb5352923bb75ad2d4712f12595"},{url:"assets/cast-00-g4W8z0Va.jpg",revision:"860390b20d6483481070413e182d25e8"},{url:"assets/cast-01-ziYkfQoV.jpg",revision:"e3ff2bc6a550159346d5f2619c8352f8"},{url:"assets/compound-5Rfo5lLI.svg",revision:"4789037b3e710c21388469cfdf5d429d"},{url:"assets/crook-00-uA_4HWjH.jpg",revision:"6bc7cb87dd668d3e0a35ed9071645915"},{url:"assets/crook-01-_Wwjk-Uc.jpg",revision:"ac82eb01f97cf0efdc01e8a33519b462"},{url:"assets/egret-00-SoZgAMAO.jpg",revision:"15c4d2575342813762797fe3019207ae"},{url:"assets/egret-01-wkn2S1-8.jpg",revision:"3502e8663069019dcb11e02288bb2b95"},{url:"assets/Flea-00-D2GNvWQ5.jpg",revision:"26b2f79cf150b38eb10827aae1152544"},{url:"assets/Flea-01-fnHrvhbM.jpg",revision:"d223536be6fdcae6351fbc432ea6d4dc"},{url:"assets/Gaffer-00-oZuFyQeo.jpg",revision:"f585f55a84b64ba02f4d1e5423079b0b"},{url:"assets/Gaffer-01-woUW279_.jpg",revision:"e40b3e2fd27e34c51d85ded9e7416a21"},{url:"assets/GB-S4-Alchemists-19-02-01-FSMtwsBJ.jpg",revision:"f6bb7ed0f9a21bfdb6286eca9837d7a5"},{url:"assets/GB-S4-Alchemists-19-02-02-2q9reDWK.jpg",revision:"ea7fe6a5fbdd2887f6b51f43dcf2c648"},{url:"assets/GB-S4-Alchemists-20-03-01-raCa_tqi.jpg",revision:"670920d0339e6d4f5d8088d30f5b5c06"},{url:"assets/GB-S4-Alchemists-20-03-02-5QLgjM4G.jpg",revision:"ff6644b5a7f14833fa7e0ca2293ddcef"},{url:"assets/GB-S4-Alchemists-20-03-04-EQtWIkGx.jpg",revision:"b2ef5feccc1e52feb49c15f9f3e36895"},{url:"assets/GB-S4-Alchemists-20-03-06-lMWPh8ks.jpg",revision:"2926f8ff73fc4783b2ebede16cfbad9c"},{url:"assets/GB-S4-Alchemists-20-03-08-eNfEa9SS.jpg",revision:"4d19fc6feeb12f81de0faf3829b41837"},{url:"assets/GB-S4-Alchemists-20-03-10-zoZxqpJ8.jpg",revision:"6bdbddc75effe3e052d6f27f663f3a9e"},{url:"assets/GB-S4-Alchemists-20-03-12-WZcGMrvb.jpg",revision:"8e6667b5878e01d907a3c44048b6b412"},{url:"assets/GB-S4-Alchemists-20-03-14-x_it2P-a.jpg",revision:"e7fa615e36570d60d8ea651e7f22a0c2"},{url:"assets/GB-S4-Alchemists-20-03-16-GdVD6VCJ.jpg",revision:"204e90da6eaed463d842ebfa2f0b6696"},{url:"assets/GB-S4-Alchemists-20-03-18-8H0w6dKK.jpg",revision:"21a143eda93b1f9331c8bde072adf3d3"},{url:"assets/GB-S4-Alchemists-20-03-20-RVel1s5Z.jpg",revision:"268cea77bd07ddd26a677cd1ff965f55"},{url:"assets/GB-S4-Alchemists-20-03-22-BtT5WrwO.jpg",revision:"fe57eded2a2abf17fb337c941fa4afe2"},{url:"assets/GB-S4-Alchemists-20-03-24-g2Ag5El-.jpg",revision:"dfe78b4dd98923fd65e2f7557e0449fe"},{url:"assets/GB-S4-Alchemists-20-03-26-vcTvXhdv.jpg",revision:"d1b6b9d83307b93ac88e3c59e1be2095"},{url:"assets/GB-S4-Alchemists-20-03-28-ODBNOpOl.jpg",revision:"de88912607141051bc01e484ed17ecfe"},{url:"assets/GB-S4-Alchemists-20-03-30-420wAow_.jpg",revision:"a798b33dec0010c379ca2341a7864727"},{url:"assets/GB-S4-Alchemists-20-03-31-U6IP3G7S.jpg",revision:"a34314fae171628c2c6e8f0ed057d442"},{url:"assets/GB-S4-Alchemists-20-03-32-7otHQ0so.jpg",revision:"9ac6062ec68363d4b2830be8de1d32ea"},{url:"assets/GB-S4-Blacksmiths-20-03-01-tWh6fF1J.jpg",revision:"35fad737775c090f3c73be619e034591"},{url:"assets/GB-S4-Blacksmiths-20-03-02-bsNEneCo.jpg",revision:"00446cdb881c8186734b0624e2573796"},{url:"assets/GB-S4-Blacksmiths-20-03-03-XD6eAAss.jpg",revision:"ccf0dccc035a00c319c701eac1cbaa5d"},{url:"assets/GB-S4-Blacksmiths-20-03-04-CM_mQKEQ.jpg",revision:"7c06f1e5317f82131a9d1843646801a3"},{url:"assets/GB-S4-Blacksmiths-20-03-06-qckS0uGX.jpg",revision:"419f4c8bfd9a460ef56684cee882a039"},{url:"assets/GB-S4-Blacksmiths-20-03-08-6JtUtag0.jpg",revision:"7e92727cd75aa1b7577e543de2f1a2e5"},{url:"assets/GB-S4-Blacksmiths-20-03-10-TzpiL-Iq.jpg",revision:"423b6bcca0c746fa545e8ab11688faad"},{url:"assets/GB-S4-Blacksmiths-20-03-12-u9Phffhj.jpg",revision:"3679ddb88ccc44da0825d185570187f6"},{url:"assets/GB-S4-Blacksmiths-20-03-14-WLAhuuJZ.jpg",revision:"ed513fc39296807b23987966c0b8fc3f"},{url:"assets/GB-S4-Blacksmiths-20-03-16-RZqe3cCF.jpg",revision:"ace100083d0af411afd245f2ee2a5600"},{url:"assets/GB-S4-Blacksmiths-20-03-18-Jc7phndQ.jpg",revision:"ec38b5a6a15227b1769e368345ffe27e"},{url:"assets/GB-S4-Blacksmiths-20-03-20-x_CpLxXw.jpg",revision:"8dc0a755d680d8244c62865a0ba8793e"},{url:"assets/GB-S4-Blacksmiths-20-03-22-kTF75kA3.jpg",revision:"b4b6f02ca4878e6e1050e075bc564617"},{url:"assets/GB-S4-Blacksmiths-20-03-24-dLqZ_F-7.jpg",revision:"ffd6f551e571c613ae86a050dd293169"},{url:"assets/GB-S4-Blacksmiths-20-03-26-WQB09aut.jpg",revision:"cff03248cece80bf6ba252e8d6d426be"},{url:"assets/GB-S4-Blacksmiths-20-03-28-CHVVmHvM.jpg",revision:"317c204fcfa5d5b8e901d6e6d1298608"},{url:"assets/GB-S4-Blacksmiths-20-03-30-M6LuhZYI.jpg",revision:"35a8439832697f856067632313bb5dc7"},{url:"assets/GB-S4-Blacksmiths-20-03-32-ydDBEJN5.jpg",revision:"fd7ffa6b6ea2bace6a25827aba7f3981"},{url:"assets/GB-S4-Brewers-20-03-01-P255RnL2.jpg",revision:"116a1d4c5d56b519a6a823be3ba6dfa8"},{url:"assets/GB-S4-Brewers-20-03-02-AH-WhK0V.jpg",revision:"d635efc29b3eac10b1cbdcca1488629b"},{url:"assets/GB-S4-Brewers-20-03-03-U6MJecgt.jpg",revision:"938f2e9d230f14033695adb251c64f7a"},{url:"assets/GB-S4-Brewers-20-03-04-ogWoTHUm.jpg",revision:"308d01bb55cb75bbcee19f318721663b"},{url:"assets/GB-S4-Brewers-20-03-06-QHJMh0Jp.jpg",revision:"67350b05630a804a81c627cb7fbf5a70"},{url:"assets/GB-S4-Brewers-20-03-08-AtUlbNIw.jpg",revision:"64482f74a0c5293ea0e805cf3f814b86"},{url:"assets/GB-S4-Brewers-20-03-10-HTUfwCo9.jpg",revision:"e304d160a6332d2059534cc37ad3f195"},{url:"assets/GB-S4-Brewers-20-03-12-Ac88Obez.jpg",revision:"4c4d3d295c6e4326f8b1a2d9ebf9e55f"},{url:"assets/GB-S4-Brewers-20-03-14-1A8SZ565.jpg",revision:"317007a647d33bb96eea61ca463d8f57"},{url:"assets/GB-S4-Brewers-20-03-16-ISyH3gL0.jpg",revision:"bf675d06ee799e7234698fdbb1df9ae2"},{url:"assets/GB-S4-Brewers-20-03-18-Nfd8YzlO.jpg",revision:"e4159d4c8db19d7f68e09245bbb84471"},{url:"assets/GB-S4-Brewers-20-03-20-IbdAKkf_.jpg",revision:"98c0e58358decc3c1f5a83e9a1c6b682"},{url:"assets/GB-S4-Brewers-20-03-22-wd5VoWma.jpg",revision:"19b7a2f54246d8b472186019ec6ba975"},{url:"assets/GB-S4-Brewers-20-03-24-Q13LWchQ.jpg",revision:"9674e3ef76648aaf6ea8c34a6c7ff6b3"},{url:"assets/GB-S4-Brewers-20-03-26-id6IXw_J.jpg",revision:"709c71fa80b86aa4149bd66af8470094"},{url:"assets/GB-S4-Brewers-20-03-28-_2OgoR9I.jpg",revision:"83e60b77a361b71b82e6e396c4404785"},{url:"assets/GB-S4-Brewers-20-03-30-Au6H70C9.jpg",revision:"03bf6d0086cda3c36d08a0d06db13f56"},{url:"assets/GB-S4-Brewers-20-03-32-qbN9femv.jpg",revision:"122c8d112c8392173054c2c244a08bbd"},{url:"assets/GB-S4-Brewers-20-03-33-M6bN8voY.jpg",revision:"daf9b4d2f9723b5b42b3d4a0da698b47"},{url:"assets/GB-S4-Brewers-20-03-34-nWhbv0nS.jpg",revision:"70cb087d8f3de7ab78a77bc145635556"},{url:"assets/GB-S4-Butchers-19-08-01-i1iJV_Ex.jpg",revision:"02a82089f4414d113f9844a7e601f2c0"},{url:"assets/GB-S4-Butchers-19-08-02-hZTs1_2z.jpg",revision:"b1a36d49a90fb3393ad64e5ebe81be52"},{url:"assets/GB-S4-Butchers-19-08-03-dW43Yd6z.jpg",revision:"9a88cf01a0990a8b67db0c45a5927655"},{url:"assets/GB-S4-Butchers-19-08-04-kd1aNGgW.jpg",revision:"76e2461807ed4bfb9e9724be8b9d9c5b"},{url:"assets/GB-S4-Butchers-19-08-06-aQ11eyQl.jpg",revision:"72a406f85f6b0b8195ca881130b14642"},{url:"assets/GB-S4-Butchers-19-08-08-T6Pvck3W.jpg",revision:"a1e7d939089f4af1d4a4b452f4cc4a5c"},{url:"assets/GB-S4-Butchers-19-08-10-KYcZyqq6.jpg",revision:"535e04a0a74446717dcd469741bc8475"},{url:"assets/GB-S4-Butchers-19-08-12-dlg4NSbE.jpg",revision:"f9e5f3eec22fa1fe5cd63b3a78de520b"},{url:"assets/GB-S4-Butchers-19-08-14-11hvCNpx.jpg",revision:"b3bf14c6652c731ac29cbb1872201f69"},{url:"assets/GB-S4-Butchers-19-08-16-Yx3rC3tn.jpg",revision:"410c636acdd2a792b84845079bcbcb1e"},{url:"assets/GB-S4-Butchers-19-08-18-Or9aNiH7.jpg",revision:"b8052fd940eff5871071b52e327288d2"},{url:"assets/GB-S4-Butchers-19-08-20-SmsmvXUZ.jpg",revision:"7edae649b442eb06281d1d61c67eb7f9"},{url:"assets/GB-S4-Butchers-19-08-22-9-44zhJB.jpg",revision:"486ab9bb252dad31fc99c356a6faa71a"},{url:"assets/GB-S4-Butchers-19-08-24-1Li9WjNk.jpg",revision:"369da01905b9166ab5ba28cff1c047ed"},{url:"assets/GB-S4-Butchers-19-08-26-zkyQY6v6.jpg",revision:"a37d0898216689f544860002176187c2"},{url:"assets/GB-S4-Butchers-19-08-28-DOjUtXHN.jpg",revision:"e6973b4f03869acc6e7a8aa5102d89ec"},{url:"assets/GB-S4-Butchers-19-08-30-mU8eoC8Q.jpg",revision:"c834a426452cea83e08164ffde811913"},{url:"assets/GB-S4-Butchers-19-08-32-gxEyxReO.jpg",revision:"5cafc7dfcf2143d3d7eaa063ded285e4"},{url:"assets/GB-S4-Cooks-19-08-01-f1XdQ1Z1.jpg",revision:"3f7f11869ecd51abbf7648064d9ba6e6"},{url:"assets/GB-S4-Cooks-19-08-02-Qkc8joVg.jpg",revision:"a0eab11a528b5af0f1709016e394e8ad"},{url:"assets/GB-S4-Cooks-19-08-03-7vFoH_ee.jpg",revision:"1adf88329af4f0d63e3a221569e0ab3d"},{url:"assets/GB-S4-Cooks-19-08-04-O0D9CBM5.jpg",revision:"88babbce6cae03b92b287afdad24fc1f"},{url:"assets/GB-S4-Cooks-19-08-06--YfSFFgz.jpg",revision:"d3179dd91b42c8e062065f773dd704e4"},{url:"assets/GB-S4-Cooks-19-08-08-duy7sURW.jpg",revision:"9364cb0d08b1de4cfcefa8324cf0b981"},{url:"assets/GB-S4-Cooks-19-08-10-YxBY0dqa.jpg",revision:"1333b800455e8315249afc493cda3f7a"},{url:"assets/GB-S4-Cooks-19-08-12-37plEuEN.jpg",revision:"55cdf075797450abce061b1ca4537a0a"},{url:"assets/GB-S4-Cooks-19-08-14-NjSkFbDL.jpg",revision:"b61b4bc7b33a6754bec80a1f51fc8542"},{url:"assets/GB-S4-Engineers-20-03-01-4vbt19Mb.jpg",revision:"4f0a95e9373233723955010b24359d5b"},{url:"assets/GB-S4-Engineers-20-03-02-stpTRS0a.jpg",revision:"05cbd51b36422c668898afadcb7d0c25"},{url:"assets/GB-S4-Engineers-20-03-03-mkzNcjzZ.jpg",revision:"e43be2c4b9357461262836ca3e281a2d"},{url:"assets/GB-S4-Engineers-20-03-04-TcL5Gv8t.jpg",revision:"9763ae4f04c9bda11f14453207ba4c9f"},{url:"assets/GB-S4-Engineers-20-03-06-K1NLMyfe.jpg",revision:"67ad821d5e550e80361203f5e53f406c"},{url:"assets/GB-S4-Engineers-20-03-08-YWVuSu2y.jpg",revision:"caf64eece60a14a559df705d9b6ddcc1"},{url:"assets/GB-S4-Engineers-20-03-10-I2Hl0USY.jpg",revision:"436aba5a516bba36b23e3d6bfd2849fb"},{url:"assets/GB-S4-Engineers-20-03-12-OTfbptKx.jpg",revision:"86ea359f94c96263a95a576209220823"},{url:"assets/GB-S4-Engineers-20-03-14-eseiX8TJ.jpg",revision:"16709e4d45015cdb898a72cd0047f3bc"},{url:"assets/GB-S4-Engineers-20-03-16-nPRf_eA5.jpg",revision:"3ecf957227e278920fd90f0c49d13b27"},{url:"assets/GB-S4-Engineers-20-03-18-tOETUh63.jpg",revision:"f1723e87535280a76ee3b2f965be166b"},{url:"assets/GB-S4-Engineers-20-03-20-K-LzslPk.jpg",revision:"014fa2433a87502bb41d5a2b7e0e375c"},{url:"assets/GB-S4-Engineers-20-03-22-x1wmOFpY.jpg",revision:"9d7de92d4bec7154cc27920a3338ee10"},{url:"assets/GB-S4-Engineers-20-03-24--oUMa8x7.jpg",revision:"ffa68468426edd66fe114dd04c4a25a5"},{url:"assets/GB-S4-Engineers-20-03-26-uYlzL2a4.jpg",revision:"ef954fee9b66e58e9a2f2502273501ec"},{url:"assets/GB-S4-Engineers-20-03-28-O7s2Qpl3.jpg",revision:"785011848ac33e82c0276d312610052b"},{url:"assets/GB-S4-Engineers-20-03-30-G6fHN1H-.jpg",revision:"7943a917fb92352100cc666446ea038f"},{url:"assets/GB-S4-Falconers-20-03-01-wDvNdlpb.jpg",revision:"053e6bcefb5fa27752005cb998e1a19a"},{url:"assets/GB-S4-Falconers-20-03-02-v66OMzsv.jpg",revision:"c70ef6a8eab8f600e2add9a1c66561b1"},{url:"assets/GB-S4-Falconers-20-03-03-Pq_GJbeQ.jpg",revision:"82a960dac9c8d2cec9f764d63742da2c"},{url:"assets/GB-S4-Falconers-20-03-04-k-gV13fn.jpg",revision:"884a42a4e1ba14c1317929a3cfe14ab8"},{url:"assets/GB-S4-Falconers-20-03-06-GoA6pejd.jpg",revision:"20efb726cea2eadd9bee1ac0e2e65acb"},{url:"assets/GB-S4-Falconers-20-03-08-skcOa8Ia.jpg",revision:"41fc3d44e0ed08f47e5be371a437e084"},{url:"assets/GB-S4-Falconers-20-03-10-NYReQ4GO.jpg",revision:"f721bfe7d24395ca5ff6a2f401c9d1b9"},{url:"assets/GB-S4-Falconers-20-03-12-mTkaVLme.jpg",revision:"211039cbb634a0122032d76d6e43333a"},{url:"assets/GB-S4-Falconers-20-03-14--1hWYymp.jpg",revision:"dc37f9149ac6c759eecf3c36ae6751fa"},{url:"assets/GB-S4-Farmers-19-12-01-C5ldsRVJ.jpg",revision:"eed8d8f30f2cf3c295a5be5b435d00b9"},{url:"assets/GB-S4-Farmers-19-12-02-jizhZ5QA.jpg",revision:"403213b8da0b1b1618c1676e344702f9"},{url:"assets/GB-S4-Farmers-19-12-03-_Uv88toO.jpg",revision:"e7828f8534219df27c011dde70a71d14"},{url:"assets/GB-S4-Farmers-19-12-04--Ve0RgK4.jpg",revision:"331477928a5c01647f9ca71882091f94"},{url:"assets/GB-S4-Farmers-19-12-06-rwupq8Sm.jpg",revision:"1344dce57b248e3dc94b06762845fa5d"},{url:"assets/GB-S4-Farmers-19-12-08-btnvVM6b.jpg",revision:"af54a1d8b66d31844f4d5eb1c1d7efdf"},{url:"assets/GB-S4-Farmers-19-12-10-VUVY9PN4.jpg",revision:"c4ac0dd5b81611e1de0cbc152522ac44"},{url:"assets/GB-S4-Farmers-19-12-12-Ne49_qRi.jpg",revision:"2c1bcecb3ea3fc9325d4d26512ff9900"},{url:"assets/GB-S4-Farmers-19-12-14-_UG1AwXs.jpg",revision:"160d6f1b2e2efba08e9b396fbd177e45"},{url:"assets/GB-S4-Farmers-19-12-16-Yubl1Ai4.jpg",revision:"f87754eaa6010720bcd3a6a3aa960e82"},{url:"assets/GB-S4-Farmers-19-12-18-mM2zoUVC.jpg",revision:"ea5f12d06a877b77f01c9118b256b41f"},{url:"assets/GB-S4-Farmers-19-12-20-n5DtcBa2.jpg",revision:"c67e5edae7f7bd1a4e0500e5a053da74"},{url:"assets/GB-S4-Farmers-19-12-22-JRvVvdms.jpg",revision:"24797606b1b136ed19e1fd11bdb244ff"},{url:"assets/GB-S4-Farmers-19-12-24-Vm4nHksw.jpg",revision:"f2d591672327d0c10ebf1f471a845600"},{url:"assets/GB-S4-Farmers-19-12-26-n7qNX2Yv.jpg",revision:"b519af02f22349e48c93178fffa89ee3"},{url:"assets/GB-S4-Farmers-19-12-28-t0jB8VnV.jpg",revision:"cfd86dbd504f22e23f9158b263e62db6"},{url:"assets/GB-S4-Farmers-19-12-30-t51I-gBL.jpg",revision:"cf68d486be1fb56fbfa4ab2a4a4cab19"},{url:"assets/GB-S4-Farmers-19-12-32-38M8Vgq7.jpg",revision:"12a18bfe82494ecce09b6d544192cbc9"},{url:"assets/GB-S4-Fishermen-19-08-01--eHJWx7n.jpg",revision:"a2272d1101172b4edecff86d88400aba"},{url:"assets/GB-S4-Fishermen-19-08-02-_8bwciRT.jpg",revision:"19a6506e3756a2cdbf305ce4e8d8c542"},{url:"assets/GB-S4-Fishermen-19-08-03-BxNsN3Iv.jpg",revision:"bdd629a74b5847cde0caad9ab66e229f"},{url:"assets/GB-S4-Fishermen-19-08-04-X1u-1dWW.jpg",revision:"c1030e8edfb77ac265230877078f078a"},{url:"assets/GB-S4-Fishermen-19-08-06-Q8sTfOPQ.jpg",revision:"22a2c136ef12551c46bb6018cc345bd7"},{url:"assets/GB-S4-Fishermen-19-08-08-KJhEtdZO.jpg",revision:"4205f913b21079af7aecf808835e7af0"},{url:"assets/GB-S4-Fishermen-19-08-10-RGOIvqkM.jpg",revision:"cd20ffed7acd7dd14ceeb55914d8637f"},{url:"assets/GB-S4-Fishermen-19-08-12-7-79zHg-.jpg",revision:"ef2c1c09a4acca749c23c4463ac294fb"},{url:"assets/GB-S4-Fishermen-19-08-14-7j0K12z2.jpg",revision:"3abbfbcb8a2726d3df3dc1fa23f3fcf3"},{url:"assets/GB-S4-Fishermen-19-08-16-yyy0VQAS.jpg",revision:"c52a32057fe676e15427c12bbcbcdc8a"},{url:"assets/GB-S4-Fishermen-19-08-18-mmiJDw_f.jpg",revision:"eb7b8d29fb9ca817ed01107ed4c5d143"},{url:"assets/GB-S4-Fishermen-19-08-20-2TNyc9vM.jpg",revision:"2ab286d2dbf5eddf18c86ea56e9996cb"},{url:"assets/GB-S4-Fishermen-19-08-22-4nIvudwx.jpg",revision:"5dac2a1e17160ffd01cc7ceed576dfaa"},{url:"assets/GB-S4-Fishermen-19-08-24-ycjKLCl_.jpg",revision:"2855e8c3a7249ca3bd21c8eee6578b24"},{url:"assets/GB-S4-Fishermen-19-08-26-4GUJCcHG.jpg",revision:"f6cf8eba4908aedee033f350584ca906"},{url:"assets/GB-S4-Fishermen-19-08-28-avhkjPEw.jpg",revision:"a132e218676cc30341efe3d8b53cc622"},{url:"assets/GB-S4-Fishermen-19-08-30-bLgrEJXW.jpg",revision:"f0737ef557ad5c2f69d42d80f70d6afb"},{url:"assets/GB-S4-Fishermen-19-08-32-qNYrO0kY.jpg",revision:"f81e062728e697530584bdae24807a9f"},{url:"assets/GB-S4-Gameplans-2019-6ffU0NQa.png",revision:"782e4dc4e42599c4f78ab3e72288ecf4"},{url:"assets/GB-S4-Hunters-19-08-01-pg26TkW9.jpg",revision:"0c33768131bf20510551139796182021"},{url:"assets/GB-S4-Hunters-19-08-02-z-uFfdlL.jpg",revision:"a2a9b611aa39b7eef2f389130534cc76"},{url:"assets/GB-S4-Hunters-19-08-03-ufXntuN8.jpg",revision:"a872e21327e94bbabaaa1f9940bba791"},{url:"assets/GB-S4-Hunters-19-08-04-ON24e145.jpg",revision:"803463f8fdd0107ce1a20c0df0885465"},{url:"assets/GB-S4-Hunters-19-08-06-73EDSYve.jpg",revision:"76c82cf60f58a4fa57deb298df66476e"},{url:"assets/GB-S4-Hunters-19-08-08-BtoiXsge.jpg",revision:"7d213d0c30c09b78f378838ed6021f30"},{url:"assets/GB-S4-Hunters-19-08-10-13NkuVEa.jpg",revision:"5e3bbb4ae51e6ba4f94b883b4e4dd6be"},{url:"assets/GB-S4-Hunters-19-08-12-Yu5502RC.jpg",revision:"5a752e8a96da903aa9fd04bafa6a6128"},{url:"assets/GB-S4-Hunters-19-08-14-jhI5nDRG.jpg",revision:"b52c5c8c4443d40b23b199824f2e8cef"},{url:"assets/GB-S4-Hunters-19-08-16-_Aa62e1j.jpg",revision:"2b9a63156136132167a9e362ffbd5773"},{url:"assets/GB-S4-Hunters-19-08-18-JvHTWKah.jpg",revision:"a4a4a86dc86ccafa1d27614271540b8a"},{url:"assets/GB-S4-Hunters-19-08-20-dP597nrw.jpg",revision:"16de6d8fd8bf202b1e22291500fe6411"},{url:"assets/GB-S4-Hunters-19-08-22-5wYB_Ird.jpg",revision:"4db899d9dbb7bdf97981bf31d2e3ef19"},{url:"assets/GB-S4-Hunters-19-08-24-bbeCSFfR.jpg",revision:"9b15a967ee551829a9b3009a081a2b28"},{url:"assets/GB-S4-Hunters-19-08-26-oTiktUlc.jpg",revision:"c11755695c085f1b4cf3e7974058735c"},{url:"assets/GB-S4-Hunters-19-08-28-B8TvdtYy.jpg",revision:"057f7790cb27d74496caaee7dd9a5ba5"},{url:"assets/GB-S4-Hunters-19-08-30-4OhC3Cxg.jpg",revision:"d1b518b444b3e7ff27504fa2103809aa"},{url:"assets/GB-S4-Hunters-19-08-32-o8GW2T81.jpg",revision:"e3679a7bf3856d8db32054f0ad45f184"},{url:"assets/GB-S4-Masons-19-03-01-lNrxro9a.jpg",revision:"5ecf637136450557c333591d76f25808"},{url:"assets/GB-S4-Masons-19-03-02-U--Qh4Sr.jpg",revision:"90e0926c16724bc5ef7dcfa32b56196a"},{url:"assets/GB-S4-Masons-19-08-01-dhfqh8ke.jpg",revision:"63e4fccd94c41041e60bbc492361dad5"},{url:"assets/GB-S4-Masons-19-08-02-g3t1DppP.jpg",revision:"fba2c69c5b91e5dc32a2c35ad6c69982"},{url:"assets/GB-S4-Masons-19-08-04-CgzaDsKG.jpg",revision:"3c06abeadea8565173fc91791ce5ef45"},{url:"assets/GB-S4-Masons-19-08-06-T6LtaN8h.jpg",revision:"810013524c62b01c88bbe04f1a7d1739"},{url:"assets/GB-S4-Masons-19-08-08-sVK98HEC.jpg",revision:"9754cca79ad5f06329c3549469d0bea2"},{url:"assets/GB-S4-Masons-19-08-10-fjQuqUBK.jpg",revision:"6e754c60d330bac2394f7075ee58e70b"},{url:"assets/GB-S4-Masons-19-08-12-SykKY7kb.jpg",revision:"0a67a8bd04b6a7a21bb3c5d4e204708e"},{url:"assets/GB-S4-Masons-19-08-14-2B_regBF.jpg",revision:"0abadabcadfb365f7c30b0daca630059"},{url:"assets/GB-S4-Masons-19-08-16--CBWsJrj.jpg",revision:"3499dcfdabcfcc98451ab68befced8b8"},{url:"assets/GB-S4-Masons-19-08-18-ggWrrLqR.jpg",revision:"588c3d9dfb0586c05e8953968ec02ce9"},{url:"assets/GB-S4-Masons-19-08-20-KHCKQDvB.jpg",revision:"043c28e76b779bb01b8d3e580c26aaa7"},{url:"assets/GB-S4-Masons-19-08-22-uSp7bSPK.jpg",revision:"57ca7be6db5069567b6332b827b73bcf"},{url:"assets/GB-S4-Masons-19-08-24-v_GiAuon.jpg",revision:"a7614bc7897852245d6858bf3df36b21"},{url:"assets/GB-S4-Masons-19-08-26-3yehH2BT.jpg",revision:"6324d9ca3684364bd21c7f7e2cfa186a"},{url:"assets/GB-S4-Masons-19-08-28-e0AWypSo.jpg",revision:"1a08141c5bc4d92f29be612372b27e3f"},{url:"assets/GB-S4-Masons-19-08-30-OpI4reGP.jpg",revision:"2a5a894c4a994407baed087fa8c75ccd"},{url:"assets/GB-S4-Miners-20-03-01--GEsghGi.jpg",revision:"f002364046ca5f62c06332bf4a788a68"},{url:"assets/GB-S4-Miners-20-03-02-KLBkX_Me.jpg",revision:"1916d412a4c429bef85fb49359e91e84"},{url:"assets/GB-S4-Miners-20-03-03-b6-19lTf.jpg",revision:"097f35852e9d7df6d4dd3ba956b9fecb"},{url:"assets/GB-S4-Miners-20-03-04-VLdQ-OLt.jpg",revision:"90938f55107ad1acedaec9ff1c0f5171"},{url:"assets/GB-S4-Miners-20-03-06-lgyTX8dV.jpg",revision:"95eb3d4c4bb7865d4f220d0b1ba54706"},{url:"assets/GB-S4-Miners-20-03-08-7K8KcuZV.jpg",revision:"a77cbc3f80d9e6206c9922c8fa6429bb"},{url:"assets/GB-S4-Miners-20-03-10-RbfEmrKL.jpg",revision:"8abe8b698f3ba5a7b020b0a885fabfea"},{url:"assets/GB-S4-Miners-20-03-12-9ULMUrfx.jpg",revision:"9434c77ec18e32a11e8cdb507274c47b"},{url:"assets/GB-S4-Miners-20-03-14-DpiGa6wl.jpg",revision:"970c0a98fa94d645131bda0e97e4afaf"},{url:"assets/GB-S4-Morticians-19-08-01-yBQ-QytF.jpg",revision:"91b429a71806ca57bd2a24ad9b6f0267"},{url:"assets/GB-S4-Morticians-19-08-02-SKdfxFIC.jpg",revision:"9a623b5136ced6666d7ab8fab7939d00"},{url:"assets/GB-S4-Morticians-19-08-03-RI0_4cTF.jpg",revision:"aa05cf951f91ee75f3c7071e69702751"},{url:"assets/GB-S4-Morticians-19-08-04-noZ0U2WX.jpg",revision:"05a0b3b8f42047f6aafd33e4dd6f3c02"},{url:"assets/GB-S4-Morticians-19-08-06-fuNeIn7K.jpg",revision:"7922cb3ac4f0593b6f9ada2701a09a57"},{url:"assets/GB-S4-Morticians-19-08-08-Putci_Qc.jpg",revision:"b2bf0e3ff0afa73945d0674a6c61ce8e"},{url:"assets/GB-S4-Morticians-19-08-10-LeRi0TbN.jpg",revision:"d86ef6c69740b2303e1bd65ad31f7c6c"},{url:"assets/GB-S4-Morticians-19-08-12-JlnnlwZ0.jpg",revision:"e3b00ec18ce0478ef5a72a85cae906db"},{url:"assets/GB-S4-Morticians-19-08-14-2Aevggu0.jpg",revision:"e7fa65cf5c7eaa3dba93a70671df986b"},{url:"assets/GB-S4-Morticians-19-08-16-1iR1YUEe.jpg",revision:"8600bcca3df682e5292262bea85c942f"},{url:"assets/GB-S4-Morticians-19-08-18-glDkk_UG.jpg",revision:"c3b7b936e1260979cf3ddd16d149a984"},{url:"assets/GB-S4-Morticians-19-08-20-ttirWwq0.jpg",revision:"7c60becb70822a809a036bd60acbe15a"},{url:"assets/GB-S4-Morticians-19-08-22-Lq00pB_L.jpg",revision:"a8f7394bc986bfe482c7447ee264900c"},{url:"assets/GB-S4-Morticians-19-08-24-7g2p-y11.jpg",revision:"a4f95af839fabbb8a38d9fe5c0137668"},{url:"assets/GB-S4-Morticians-19-08-26-BB0yLRSv.jpg",revision:"5f535414ff711851cd9a405c06aa7f79"},{url:"assets/GB-S4-Morticians-19-08-28-Ef6o-ewI.jpg",revision:"ff17f0f103e2ed4b40720f7b3a4b76c3"},{url:"assets/GB-S4-Morticians-19-08-30--7YMJRB7.jpg",revision:"6dec6af9034a69468d557ee3cab36724"},{url:"assets/GB-S4-Morticians-19-08-32-K1ittHaT.jpg",revision:"4f3deba570d79193f5f2d4d246ed12c6"},{url:"assets/GB-S4-Morticians-19-08-34-ppeyjRx0.jpg",revision:"6b8a58550856503525a1e25af2f44eb1"},{url:"assets/GB-S4-Navigators-20-03-01-DOzd0J5v.jpg",revision:"746ba18d365bdafeac07141c644e8658"},{url:"assets/GB-S4-Navigators-20-03-02-tA71C8uJ.jpg",revision:"5ff1198b1ef4e925f458f595c7a4df6d"},{url:"assets/GB-S4-Navigators-20-03-03-7mNG4_Gy.jpg",revision:"dcf15f4b9cc1d418d8b26a69f7369c90"},{url:"assets/GB-S4-Navigators-20-03-04-ueIl3RyZ.jpg",revision:"4fc741ecce69afd1d137d6da7a867e5d"},{url:"assets/GB-S4-Navigators-20-03-05-4oz5FVNH.jpg",revision:"1118995e4db9d19e3282bb8e21526ae4"},{url:"assets/GB-S4-Navigators-20-03-07-JNonz6fA.jpg",revision:"5fa29a693d6cc92ba597489ef62578e4"},{url:"assets/GB-S4-Navigators-20-03-10-JMYL68BX.jpg",revision:"91da902022dca44cac74fe78f1d39b11"},{url:"assets/GB-S4-Navigators-20-03-11-ywa595R7.jpg",revision:"983a227db74c0529d2f62fce76ebaf26"},{url:"assets/GB-S4-Navigators-20-03-14-OCyTP0AG.jpg",revision:"c890144e2e5c04afdba19e753d0db12c"},{url:"assets/GB-S4-Order-19-08-01-GrGZyqoU.jpg",revision:"a4bf77060eb608c11196ad9f1d75bd88"},{url:"assets/GB-S4-Order-19-08-02-8WMcCMn4.jpg",revision:"cc278681d4dcd72a2af449993a0bfb00"},{url:"assets/GB-S4-Order-19-08-04-dTRyL0B8.jpg",revision:"60c4f403a9a058b639b9d11a58ad2caf"},{url:"assets/GB-S4-Order-19-08-06-cQkz9fJk.jpg",revision:"2257985559bcd85820c0e088f3510669"},{url:"assets/GB-S4-Order-19-08-08-1i1gjQT6.jpg",revision:"2d9dbdc7d39e6d1ce565dc62fc393e2d"},{url:"assets/GB-S4-Order-19-08-10-nZrAtJO4.jpg",revision:"f8ceab97d9e7f4cdb148c0be63fd468b"},{url:"assets/GB-S4-Order-19-08-12-lJ5abgyK.jpg",revision:"08efc06863c6eadf529f1ca7cda95e87"},{url:"assets/GB-S4-Order-19-08-14-Dds70HWJ.jpg",revision:"520304c08ac462c43c17e0e9c10cbd22"},{url:"assets/GB-S4-Order-19-08-16-cRiBqBs0.jpg",revision:"75ba8873e7dac6d09928be44b18f8f9b"},{url:"assets/GB-S4-Order-19-08-18-IJI_LJBb.jpg",revision:"3fc1fe0510c16dc116bfb8cd746c46a3"},{url:"assets/GB-S4-Ratcatchers-19-08-01-m1xwVCcS.jpg",revision:"b7935b300ea9384d6976b8a7366371cf"},{url:"assets/GB-S4-Ratcatchers-19-08-02-F2wYzZlE.jpg",revision:"9182085c8b26cf940db105ce39be0b3b"},{url:"assets/GB-S4-Ratcatchers-19-08-03-L3-Zf6XA.jpg",revision:"e05357ca6a7e76af361e1a4a6e01317d"},{url:"assets/GB-S4-Ratcatchers-19-08-04-Z7881zxP.jpg",revision:"7fc398944ec8a16ea649c247a2f04539"},{url:"assets/GB-S4-Ratcatchers-19-08-06-5ajdaPIv.jpg",revision:"dc4d3b4d5499a8f36973b4a58c59bc46"},{url:"assets/GB-S4-Ratcatchers-19-08-08-cHIrmzlq.jpg",revision:"2ac574c14258cde3668743dd63d1b91f"},{url:"assets/GB-S4-Ratcatchers-19-08-10-7UAq95Be.jpg",revision:"72d7ec42ce2c483c9eb91e12965a47b4"},{url:"assets/GB-S4-Ratcatchers-19-08-12-CVLNl5Ya.jpg",revision:"4ed0da7a426746682a63e8764da85b78"},{url:"assets/GB-S4-Ratcatchers-19-08-14-9SckSuXm.jpg",revision:"081b9327a1431ba0857af95e83460fb0"},{url:"assets/GB-S4-Shepherds-20-03-01-bMw8p-55.jpg",revision:"6494651ccc7a4d358a70446a8407b263"},{url:"assets/GB-S4-Shepherds-20-03-02-F6sC3pIq.jpg",revision:"9c799668946683a081a60ec41a3a01a2"},{url:"assets/GB-S4-Shepherds-20-03-03-ifhpy3pP.jpg",revision:"95583ae7eccfcff510eec8daeeec97a1"},{url:"assets/GB-S4-Shepherds-20-03-04-qSVGyCuR.jpg",revision:"8aa1a968a38adf66e57b131651e0cd3b"},{url:"assets/GB-S4-Shepherds-20-03-06-E2TydSRE.jpg",revision:"80c5352af02130696f4e5b13b260fbc2"},{url:"assets/GB-S4-Shepherds-20-03-08-Hz3RBarI.jpg",revision:"a29508f945390dcb8b4080458bc50a68"},{url:"assets/GB-S4-Shepherds-20-03-10-_LzTVTGo.jpg",revision:"917500019387220e6ffc7100bfc7375e"},{url:"assets/GB-S4-Shepherds-20-03-12-rOnjXYLq.jpg",revision:"0b8525c39703d2127d772ce079df90a3"},{url:"assets/GB-S4-Shepherds-20-03-14-BETiz5dZ.jpg",revision:"e5a0b3b45b75bc6120fff67944bcdf73"},{url:"assets/GB-S4-Shepherds-20-03-16-h-895uOj.jpg",revision:"2e17364f4e49bb14854708bf8f2377dd"},{url:"assets/GB-S4-Union-20-03-01-WFH_3DyC.jpg",revision:"fc81e31914e53aff094899e48bfcb492"},{url:"assets/GB-S4-Union-20-03-02-gH1rqtZw.jpg",revision:"a1ac6b64f720ddf360d60e8b8e36152a"},{url:"assets/GB-S4-Union-20-03-03-ckV-mX-u.jpg",revision:"3a56f667eed8adfc0a94be9b18473cad"},{url:"assets/GB-S4-Union-20-03-04-xEiiCpXH.jpg",revision:"a4e7163a409a453e8dc099c112b60bef"},{url:"assets/GB-S4-Union-20-03-06-Ex_xYYZ7.jpg",revision:"7fec51e1f39b76cdffbdc5cc2e752022"},{url:"assets/GB-S4-Union-20-03-08-vWnBuRso.jpg",revision:"df990df8add46cd855842d1bbfeb6ab0"},{url:"assets/GB-S4-Union-20-03-10-UWZSTzVg.jpg",revision:"283a3e3ae9bd48a0ecf70c44488ba5be"},{url:"assets/GB-S4-Union-20-03-12-Pk3n5oIx.jpg",revision:"5ebd175ea63480f9892251d12ce035da"},{url:"assets/GB-S4-Union-20-03-14-6E9HAQAv.jpg",revision:"143a30be922f5a74ced2d5ec5a5fd973"},{url:"assets/GB-S4-Union-20-03-16-6wyz02ST.jpg",revision:"d6acfd4a1417314eedad67e04359d178"},{url:"assets/GB-S4-Union-20-03-18-G3ncl74Q.jpg",revision:"30606a1416be472526c4c975df781aed"},{url:"assets/GB-S4-Union-20-03-20-g3Fnwwae.jpg",revision:"eab985fcc94c4613672c0592676d7d6a"},{url:"assets/GB-S4-Union-20-03-22-xVZ7pxcW.jpg",revision:"1fa2d6b00a509d9c12d09ceae9c08a44"},{url:"assets/GB-S4-Union-20-03-24-08QN0hqu.jpg",revision:"8e892e2e4ac4c2b9a453650b7fe90d91"},{url:"assets/GB-S4-Union-20-03-26-aN6Sefea.jpg",revision:"ae139ac1824ad35392568a99d75c319b"},{url:"assets/GB-S4-Union-20-03-28-oseHILx9.jpg",revision:"5ff2e5b7424fa08754e9ecfd8e31fc8e"},{url:"assets/GB-S4-Union-20-03-30-zj0MbDBV.jpg",revision:"1b45bc9c69a1dbb87f144462bf032162"},{url:"assets/gb-symbol-defs-71APP-OC.svg",revision:"ccdac658432671fc17ac299f74af2532"},{url:"assets/heat_full-aQwfz4fL.jpg",revision:"b29aeeca6d67ea845afa4f5991c38832"},{url:"assets/heat-JINDXtK4.jpg",revision:"2f22f4701c6264c878ee74408f6f4123"},{url:"assets/hook-00-QrcTkT9q.jpg",revision:"70fccc09e1efefdcf70bd13d61b9ffc1"},{url:"assets/hook-01-hRF07KQ1.jpg",revision:"17b3fa2b94a14ab56f22a3159c5c4010"},{url:"assets/ikaros-00-ZSttwEFk.jpg",revision:"8119cdf86afc3da8a3d78a0359397849"},{url:"assets/ikaros-01-mk1mK9xO.jpg",revision:"2c7a2a839f715ad7020a00db15de3dfc"},{url:"assets/index-fCpOoyBc.js",revision:"6749c2e396a26474d34cef531b1ba9e8"},{url:"assets/index-JMmIEeDW.css",revision:"659caf22bf35da3088b606e414f7c805"},{url:"assets/lamp-beta-Otx5Vmnm.png",revision:"8649d3d06b7d8f4f1d7d835e10a0b10b"},{url:"assets/lamps_back_blank-2sT3fzqF.jpg",revision:"b70026863f234870d3185ae393c8ae48"},{url:"assets/Locus-00-ZVGIii94.jpg",revision:"9bc9b50d9f1ce7caa2d116e66608a629"},{url:"assets/Locus-01-oCXkgASK.jpg",revision:"b3caaa5f8878c19e4a1f3bf895e18330"},{url:"assets/lucky-00-Pt8H9UPq.jpg",revision:"8af44f455c4828781d3ee4d1da4fab0c"},{url:"assets/lucky-01-nhThJG--.jpg",revision:"e6cdb32b6ea939291c1ddbb5ab30ef82"},{url:"assets/lucky-J9wIxj86.svg",revision:"bd69dbda156b13e916224dc015a4509a"},{url:"assets/miasma-00-ICblSo9K.jpg",revision:"380b6c9fc0b7fd5062b135faf7e8e405"},{url:"assets/miasma-01-RaWSoNxx.jpg",revision:"2e31a041b1ffa9b129413c4979a6b249"},{url:"assets/minx-00-DT8Oqdc4.jpg",revision:"a03183429f373542fac86d675607183b"},{url:"assets/minx-01-IeALwHtj.jpg",revision:"101af68e44bea14908f8bda6907e602c"},{url:"assets/nightlight_full-ErhmBPXi.jpg",revision:"a5842074d0572f6b6f0f6696e7be5ae4"},{url:"assets/nightlight_smallbox-sKmS2SAA.jpg",revision:"cb6076744268baf4e539e34d49aa13b8"},{url:"assets/Order_back-KrHqTN94.jpg",revision:"e02dd6faf4c24c50f6499f695c4f2a61"},{url:"assets/phosphor_full-L5HfSGc5.jpg",revision:"0a95ba662cff425f90cdb398bb1d69cb"},{url:"assets/phosphor_smallbox-rpYscqjM.jpg",revision:"41f5bfed7e0b59cb13636a9c50350874"},{url:"assets/playbook-symbol-defs-890LC9Sl.svg",revision:"03e3be4efb6021d486a3e4fe36dadb8b"},{url:"assets/Salt-00-04qWuFav.jpg",revision:"054afe46a7c45a09bb0de1eb25293bbf"},{url:"assets/Salt-01-4F_t8Klz.jpg",revision:"bb8f882ea1adfc46c4d43edf9bb146c3"},{url:"assets/soot_full-d5nuut23.jpg",revision:"44961dbf9764e81bcd7352531ac5bcb7"},{url:"assets/soot-lxHLNgU8.jpg",revision:"bfdaf521a45e0edbdd4a2edb4d72d67d"},{url:"assets/steeljaw-00-wcpT-e2u.jpg",revision:"04cb51841d5f294adacfd690dd076ac7"},{url:"assets/steeljaw-01-x73ZA97t.jpg",revision:"75e4187a44d557d944e549d70aa5d045"},{url:"assets/tenderiser-00-yXlo2Wgk.jpg",revision:"2bcfb37d53d9e94f684c1cdef961e8ef"},{url:"assets/tenderiser-01-5-dwQqjC.jpg",revision:"79ec8770a134e413bc1408a5729548e2"},{url:"assets/Truffles-00-cUyCHkOA.jpg",revision:"e109b257dc4e3f98f724f5759a0bc0fe"},{url:"assets/Truffles-01-NcRsjCDr.jpg",revision:"2afa42701768f9241103eea288a12293"},{url:"assets/Ulfr-00-V4ZRsZgL.jpg",revision:"546f7c8ad0341ac023ed28424021220c"},{url:"assets/Ulfr-01-CUH6HFXH.jpg",revision:"cd4c0334bd3e6ad1174ad623e5bc30e9"},{url:"assets/vGutter-00-qZzYfT-M.jpg",revision:"ce1d7a54564c61bfb1ab926e8151fe5d"},{url:"assets/vGutter-01-Vh0ddt-G.jpg",revision:"4c375ee485815eaf36c5390fe9fe6ad5"},{url:"assets/wick_full-kQJx8jVk.jpg",revision:"ef97ecc03b53b34e6b18bbc7425770f8"},{url:"assets/wick-9dF2bssx.jpg",revision:"50aa44d79931cbe394d005371138b120"},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"data/gameplans.json",revision:"84197a88c0201e0335c7e8015c953c77"},{url:"data/GB-Playbook-4-3.json",revision:"1a4f4a1358660139d5399a85a80518c6"},{url:"data/GB-Playbook-4-4.json",revision:"3240fa72163148cbc56b969d9f5d7f93"},{url:"data/GB-Playbook-4-5.json",revision:"e11e11376b0f345f515c155a8012fc2f"},{url:"data/manifest.json",revision:"26fe67ac923c66267e9dcfeee9c68c65"},{url:"docs/GB-S4-FAQ-19-12-20.pdf",revision:"80fcbe4021495e7450e16801fcc033e7"},{url:"docs/GB-S4-RegionalCup-Rules-200128__1.pdf",revision:"c52ebc46e3233fa097e32b51ebf2c484"},{url:"docs/GB-S4-Rulebook-4.1.pdf",revision:"9524097439299f087a5f40f417f7b133"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"index.html",revision:"a9d5bbb4c15c80841e34e71b54af1513"},{url:"manifest.webmanifest",revision:"a9121016eaef4c6c02585821c2e74f1a"},{url:"maskable-icon-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"maskable-icon-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"docs/GB-S4-FAQ-19-12-20.pdf",revision:"80fcbe4021495e7450e16801fcc033e7"},{url:"docs/GB-S4-RegionalCup-Rules-200128__1.pdf",revision:"c52ebc46e3233fa097e32b51ebf2c484"},{url:"docs/GB-S4-Rulebook-4.1.pdf",revision:"9524097439299f087a5f40f417f7b133"},{url:"data/GB-Playbook-4-3.json",revision:"1a4f4a1358660139d5399a85a80518c6"},{url:"data/GB-Playbook-4-4.json",revision:"3240fa72163148cbc56b969d9f5d7f93"},{url:"data/GB-Playbook-4-5.json",revision:"e11e11376b0f345f515c155a8012fc2f"},{url:"data/gameplans.json",revision:"84197a88c0201e0335c7e8015c953c77"},{url:"data/manifest.json",revision:"26fe67ac923c66267e9dcfeee9c68c65"},{url:"manifest.webmanifest",revision:"a9121016eaef4c6c02585821c2e74f1a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new e.CacheFirst({cacheName:"gstatic-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
