if(!self.define){let s,e={};const l=(l,r)=>(l=new URL(l+".js",r).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(r,n)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let u={};const a=s=>l(s,i),o={module:{uri:i},exports:u,require:a};e[i]=Promise.all(r.map((s=>o[s]||a(s)))).then((s=>(n(...s),u)))}}define(["./workbox-f407626e"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"assets/Angel-00-_OcCE1xs.jpg",revision:null},{url:"assets/Angel-01-RsyL_b7r.jpg",revision:null},{url:"assets/beacon-00-L9zfj4Q8.jpg",revision:null},{url:"assets/beacon-01-vYao7kaT.jpg",revision:null},{url:"assets/beacon-WzU-Fgwo.jpg",revision:null},{url:"assets/Blackheart-00-Barboaw1.jpg",revision:null},{url:"assets/Blackheart-01-DqXGaAGL.jpg",revision:null},{url:"assets/Brisket-00-fpn5lXhR.jpg",revision:null},{url:"assets/Brisket-01-Cz0yKYaC.jpg",revision:null},{url:"assets/brisket3-00-TRUFkM-Q.jpg",revision:null},{url:"assets/brisket3-01-C19fZQ9I.jpg",revision:null},{url:"assets/cast-00-CDhbzPRV.jpg",revision:null},{url:"assets/cast-01-DOJiR9Ch.jpg",revision:null},{url:"assets/compound-DlF-jmUs.svg",revision:null},{url:"assets/crook-00-C4D_gdaM.jpg",revision:null},{url:"assets/crook-01-D9bCOT5R.jpg",revision:null},{url:"assets/egret-00-BKhmAAwA.jpg",revision:null},{url:"assets/egret-01-DCSfZLX7.jpg",revision:null},{url:"assets/Flea-00-PYY29ZDm.jpg",revision:null},{url:"assets/Flea-01-B-ceu-Fs.jpg",revision:null},{url:"assets/Gaffer-00-Chm4XJB6.jpg",revision:null},{url:"assets/Gaffer-01-DChRbbv3.jpg",revision:null},{url:"assets/gaffer-front-large-box-BhDGw3yv.png",revision:null},{url:"assets/GB-S4-Alchemists-19-02-01-VIy3CwEn.jpg",revision:null},{url:"assets/GB-S4-Alchemists-19-02-02-Dar2t4NY.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-01-CtoJr-2q.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-02-DlAuCMzg.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-04-RC1YiQbH.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-06-CUxY-HyS.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-08-B418Rr1J.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-10-DOhnGqkn.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-12-BZlwYyu9.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-14-DH-K3Y_5.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-16-Z1UPpUIk.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-18-DwfTDp0o.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-20-BFV6XWzl.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-22-G1PlavA6.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-24-CDYCDkSX.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-26-C9xO9eF2.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-28-4ME06k6U.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-30-DjbTACjD.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-31-BTog_cbt.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-32-Dui0dDSy.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-01-C1aHp8XU.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-02-Buw0Sd4K.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-03-BcPp4ACy.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-04-Iz-ZAoRD.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-06-CpyRLS4Z.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-08-Dom1S1qD.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-10-BPOmIv4i.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-12-C70-F9-G.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-14-BYsCG64l.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-16-BFmp7dwI.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-18-lzumGd1B.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-20-DH8KkvFf.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-22-CRMXvmQD.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-24-B0upn8X7.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-26-BZAHT1q6.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-28-IdVWYe8z.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-30-zou6Flgi.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-32-DJ0MEQk3.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-01-_bnlGcvZ.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-02-Af5aErRU.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-03-BTowl5yC.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-04-CiBahMdS.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-06-BAckyHQm.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-08-C1SVs0jC.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-10-dNR_AKj3.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-12-Bzzw5t7M.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-14-DUDxJnnr.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-16-hLIfeAvT.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-18-193xjOU7.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-20-ht0AqR_9.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-22-DB3lWhaZ.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-24-BDXctZyF.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-26-CJ3ohfD8.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-28-D_Y6ChH0.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-30-C7ofvQL3.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-32-Cps3196a.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-33-zps3y-hi.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-34-CdaFu_Sd.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-01-CLWIlX8T.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-02-CFlOzX_b.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-03-B1bjdh3r.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-04-CR3Vo0aB.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-06-BpDXV7JC.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-08-BPo-9yTd.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-10-phxnKqrp.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-12-B2WDg1Js.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-14-DXWG8I2n.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-16-BjHesLe2.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-18-6v1o2Ifu.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-20-BKaya9dR.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-22-D37jjOEk.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-24-DUuL1aM2.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-26-DOTJBjq_.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-28-M6NS1cc0.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-30-CZTx6gLx.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-32-CDETLFF4.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-01-B_Vd1DVn.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-02-BCRzyOhW.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-03-Du8Wgf95.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-04-7QP0IEzl.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-06-D5h9IUWD.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-08-B27LuxRF.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-10-BjEFjR2p.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-12-DfumUS4Q.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-14-2NKQVsMs.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-01-Di9u3X0x.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-02-Cy2lNFLR.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-03-CaTM1yPN.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-04-BNwvka_y.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-06-rU0szJ96.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-08-BhZW5K7b.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-10-jYeXRRJi.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-12-5N9um0rG.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-14-B6x6JfxM.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-16-Cc9F_94D.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-18-C04RNSHr.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-20-r4vOyU-R.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-22-DHXCY4Wl.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-24-D6hQxrzH.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-26-C5iXMvZr.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-28-7uzZCmXc.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-30-bp8c3Uf4.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-01-DAO812Wl.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-02-C_ro4zOy.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-03--r8Ylt5C.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-04-CT6BXXd-.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-06-agDql6N2.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-08-CyRw5rwh.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-10-1hF5DgY6.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-12-CZORpUuZ.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-14-D7WFZjKa.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-01-LmV2xFUn.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-02-COLOFnlA.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-03-D9S_zy2g.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-04-D5V7RGAr.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-06-CvC6mrxK.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-08-Bu2e9Uzp.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-10-BVRVj083.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-12-17j3-pGL.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-14-D9QbUDBe.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-16-Bi5uXUCL.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-18-CYzbOhRU.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-20-CfkO1wFr.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-22-lG9W92aw.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-24-BWbiceSz.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-26-Cfuo1fZi.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-28-C3SMHxWd.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-30-C3nUj6AE.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-32-DfwzxWCr.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-01-D54clbHu.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-02-D_xvByJF.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-03-HE2w3ci9.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-04-BfW77V1Z.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-06-BDyxN849.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-08-omES11k4.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-10-BEY4i-qQ.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-12-Dv7v3MeD.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-14-DuPQrXbP.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-16-DLLLRVAB.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-18-CaaIkPD9.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-20-DZM3Jz28.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-22-Dici-53D.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-24-DJyMosKX.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-26-DgZQkJwc.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-28-Bq-GSM8T.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-30-BsuCsQld.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-32-Co1is7SR.jpg",revision:null},{url:"assets/GB-S4-Gameplans-2019-Dp99TQ1B.png",revision:null},{url:"assets/GB-S4-Hunters-19-08-01-CmDbpORb.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-02-DP64V92U.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-03-C59ee243.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-04-43bh7Xjn.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-06-DvcQNJi9.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-08-G2iJeyB7.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-10-DXc2S5UR.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-12-Bi7nnTZE.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-14-COEjmcNE.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-16-D8BrrZ7W.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-18-m8dNYpqE.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-20-B0_n3uev.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-22-DnBgH8it.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-24-Btt4JIV9.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-26-ChOKS1SV.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-28-HxO921jJ.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-30-Dg6ELcLG.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-32-CjwZbZPz.jpg",revision:null},{url:"assets/GB-S4-Masons-19-03-01-CU2vGuj1.jpg",revision:null},{url:"assets/GB-S4-Masons-19-03-02-BT75CHhK.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-01-B2F-qHyR.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-02-CDe3UOmk.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-04-KDNoOwoa.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-06-BPou1o3y.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-08-CxUr3wcQ.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-10-B-NC6pQE.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-12-BLKQpjuR.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-14-DYH-t6AE.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-16-D4IFawmu.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-18-CCBausup.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-20-ocIpAO8E.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-22-C5KnttI8.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-24-C_8aIC6i.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-26-DfJ6EfYF.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-28-B7QBbKlK.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-30-6kjit4Y9.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-01-D4YSyCEa.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-02-osGRf8x4.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-03-Bvr7X2VN.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-04-BUt1D44u.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-06-CWDJNfx1.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-08-Dsrwpy5l.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-10-BFt8Saso.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-12-D1QsxSt_.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-14-OmIZrrCX.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-01-DIFD5DK0.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-02-BIp1_EUg.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-03-BEjT_hxM.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-04-CehnRTZZ.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-06-B-414ifs.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-08--61yL9Bw.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-10-t5GLRNs2.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-12-mWeeXBnS.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-14-DYB6-CC7.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-16-DWJHVhQR.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-18-CCUOST9Q.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-20-C22KtbCr.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-22-urTSkH8v.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-26-EHTItFK_.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-28-R_qj57Ah.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-30-D7tgwlEH.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-32-rWK20dpO.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-34-Cml7KNHH.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-01-M7N3Qnm9.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-02-C0DvULy4.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-03-DuY0bj8b.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-04-C54iXdHJ.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-05-DijPkVU0.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-07-k2ifPp8C.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-10-kxgvrwFf.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-11-DLBrn3lH.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-14-4LJM_QAb.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-01-asZnKqhR.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-02-DxYxwIyf.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-04-B1NHIvQH.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-06-BxCTP18m.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-08-DWLWCNBP.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-10-CdmsC0k7.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-12-CUnlpuDI.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-14-N2zvQdYm.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-16-BxGIGoGz.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-18-gkj8skFt.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-01-CbXHBUJx.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-02-XbBjNmUR.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-03-vf5l_pcD.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-04-BnvzzXPE.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-06-DlqN1o8i.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-08-BwciubOW.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-10-DtQCr3kF.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-12-JUs2Xlho.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-14-D1JyRK5e.jpg",revision:null},{url:"assets/GB-S4-Reference-1-Cx3eC7d4.png",revision:null},{url:"assets/GB-S4-Reference-2-CJ4YgyH9.png",revision:null},{url:"assets/GB-S4-Reference-3-BTbZpB51.png",revision:null},{url:"assets/GB-S4-Reference-4-CpP58Tap.png",revision:null},{url:"assets/GB-S4-Reference-5-Be8xjsp1.png",revision:null},{url:"assets/GB-S4-Shepherds-20-03-01-BszDyn7n.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-02-XqwLekip.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-03-CJ-GnLek.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-04-CpJUbIK5.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-06-TZPJ1JER.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-08-fPdEFqsg.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-10-D8vNNVMa.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-12-Cs6eNdgu.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-14-EROLPl1k.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-16-CH7z3m46.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-01-BYUf_cPI.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-02-CAfWuq1n.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-03-ByRX6Zf6.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-04-DESKIKlc.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-06-TH_Fhhnv.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-08-C9acG5Gy.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-10-BRZlJPNW.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-12--TefmgjH.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-14-DoT0cBAC.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-16-DrDLPTZJ.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-18-bedyXvhB.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-20-CDcWfDBp.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-22-DFVnunFx.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-24-DTxA3SGq.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-26-Bo3pJ595.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-28-Cix4cgvH.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-30-DOPQxsMF.jpg",revision:null},{url:"assets/gb-symbol-defs-DvUA8_44.svg",revision:null},{url:"assets/heat-00-D38QQgsn.jpg",revision:null},{url:"assets/heat-01-TaWfEq1e.jpg",revision:null},{url:"assets/heat-kg0Ne0rh.jpg",revision:null},{url:"assets/hook-00-BCtxORP2.jpg",revision:null},{url:"assets/hook-01-CFEXTspD.jpg",revision:null},{url:"assets/ikaros-00-BlK23AQW.jpg",revision:null},{url:"assets/ikaros-01-CaTWYr3E.jpg",revision:null},{url:"assets/index-DL7tBzDY.css",revision:null},{url:"assets/index-E5PEridQ.js",revision:null},{url:"assets/lamp-beta-63HlWaeb.png",revision:null},{url:"assets/lamps_back_blank-DaxPd_Oo.jpg",revision:null},{url:"assets/Locus-00-BlUYiKL3.jpg",revision:null},{url:"assets/Locus-01-CgJeSABI.jpg",revision:null},{url:"assets/lucky-00--3wf1Q-o.jpg",revision:null},{url:"assets/lucky-01-CeFOEkb7.jpg",revision:null},{url:"assets/lucky-n3AjGPzo.svg",revision:null},{url:"assets/miasma-00-gJuVKj0r.jpg",revision:null},{url:"assets/miasma-01-BFpZKg3H.jpg",revision:null},{url:"assets/minx-00-DKid1QgM.jpg",revision:null},{url:"assets/minx-01-h4AvAe2P.jpg",revision:null},{url:"assets/nightlight-00-DeG30Qno.jpg",revision:null},{url:"assets/nightlight-01-B5GmfHdF.jpg",revision:null},{url:"assets/nightlight-BICbD_Qy.jpg",revision:null},{url:"assets/Order_back-qsepM33g.jpg",revision:null},{url:"assets/phosphor-00-kYBsDzr4.jpg",revision:null},{url:"assets/phosphor-01-aCMgs7Xa.jpg",revision:null},{url:"assets/phosphor-CifRCYrC.jpg",revision:null},{url:"assets/playbook-symbol-defs-Dz3QsL1K.svg",revision:null},{url:"assets/Salt-00-DTipa4Vq.jpg",revision:null},{url:"assets/Salt-01-DgX-3wqX.jpg",revision:null},{url:"assets/soot-00-CjgkmHEF.jpg",revision:null},{url:"assets/soot-01-DLvloUPB.jpg",revision:null},{url:"assets/soot-CXEcs2BT.jpg",revision:null},{url:"assets/steeljaw-00-DBylP57a.jpg",revision:null},{url:"assets/steeljaw-01-DHvdkD3u.jpg",revision:null},{url:"assets/tenderiser-00-DJeWjZaC.jpg",revision:null},{url:"assets/tenderiser-01-Dn53BCqM.jpg",revision:null},{url:"assets/Truffles-00-BxTIIeQ4.jpg",revision:null},{url:"assets/Truffles-01-1xGyMIOv.jpg",revision:null},{url:"assets/Ulfr-00-BXhlGxmA.jpg",revision:null},{url:"assets/Ulfr-01-JQfocVce.jpg",revision:null},{url:"assets/vGutter-00-CpnNh9P4.jpg",revision:null},{url:"assets/vGutter-01-BWHR1234.jpg",revision:null},{url:"assets/wick-00-CEZ6BY1J.jpg",revision:null},{url:"assets/wick-01-DtuDStax.jpg",revision:null},{url:"assets/wick-D10XZuyz.jpg",revision:null},{url:"assets/workbox-window.prod.es5-Ck4lWPv4.js",revision:null},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"data/gameplans.json",revision:"84197a88c0201e0335c7e8015c953c77"},{url:"data/GB-Playbook-4-3.json",revision:"92b689cb87b03ad4b17a13d4c8149687"},{url:"data/GB-Playbook-4-4.json",revision:"5385d14b70c849f475758648abddbe36"},{url:"data/GB-Playbook-4-5.json",revision:"ebf4b91061ca5728eb53d8f9d41f8edc"},{url:"data/GB-Playbook-4-6.fr.json",revision:"bbfed4136fee67e6888a8ff5e9d7f088"},{url:"data/GB-Playbook-4-6.json",revision:"f609abebce605d01f9308eeb83641f29"},{url:"data/manifest.json",revision:"914d28859b95660a84eb915984c3ed47"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"index.html",revision:"6e8ea6572b2b3ae58ce9e789ecb025cc"},{url:"manifest.webmanifest",revision:"a9121016eaef4c6c02585821c2e74f1a"},{url:"maskable-icon-512x512.png",revision:"6ef31a886aa1b0f4561ddc92364e8bd1"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"maskable-icon-512x512.png",revision:"6ef31a886aa1b0f4561ddc92364e8bd1"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"data/GB-Playbook-4-3.json",revision:"92b689cb87b03ad4b17a13d4c8149687"},{url:"data/GB-Playbook-4-4.json",revision:"5385d14b70c849f475758648abddbe36"},{url:"data/GB-Playbook-4-5.json",revision:"ebf4b91061ca5728eb53d8f9d41f8edc"},{url:"data/GB-Playbook-4-6.fr.json",revision:"bbfed4136fee67e6888a8ff5e9d7f088"},{url:"data/GB-Playbook-4-6.json",revision:"f609abebce605d01f9308eeb83641f29"},{url:"data/gameplans.json",revision:"84197a88c0201e0335c7e8015c953c77"},{url:"data/manifest.json",revision:"914d28859b95660a84eb915984c3ed47"},{url:"manifest.webmanifest",revision:"a9121016eaef4c6c02585821c2e74f1a"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute(/^https:\/\/docs\.guildball\.app\/.*/i,new s.CacheFirst({cacheName:"guildball-docs",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new s.CacheFirst({cacheName:"gstatic-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
