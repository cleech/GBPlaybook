if(!self.define){let s,e={};const l=(l,r)=>(l=new URL(l+".js",r).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(r,n)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let u={};const a=s=>l(s,i),o={module:{uri:i},exports:u,require:a};e[i]=Promise.all(r.map((s=>o[s]||a(s)))).then((s=>(n(...s),u)))}}define(["./workbox-f407626e"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"assets/Angel-00-PznAhNcb.jpg",revision:null},{url:"assets/Angel-01-EbMi_2-6.jpg",revision:null},{url:"assets/beacon_full-4i7LokvB.jpg",revision:null},{url:"assets/beacon-Fs1PhYMK.jpg",revision:null},{url:"assets/Blackheart-00-Wq26GsNd.jpg",revision:null},{url:"assets/Blackheart-01-6lxmgBi9.jpg",revision:null},{url:"assets/Brisket-00-H6Z-ZV4U.jpg",revision:null},{url:"assets/Brisket-01-s9MimGgk.jpg",revision:null},{url:"assets/brisket3-00-dzK3s2p-.jpg",revision:null},{url:"assets/brisket3-01-tfX2UPSJ.jpg",revision:null},{url:"assets/cast-00-g4W8z0Va.jpg",revision:null},{url:"assets/cast-01-ziYkfQoV.jpg",revision:null},{url:"assets/compound-5Rfo5lLI.svg",revision:null},{url:"assets/crook-00-uA_4HWjH.jpg",revision:null},{url:"assets/crook-01-_Wwjk-Uc.jpg",revision:null},{url:"assets/egret-00-SoZgAMAO.jpg",revision:null},{url:"assets/egret-01-wkn2S1-8.jpg",revision:null},{url:"assets/Flea-00-D2GNvWQ5.jpg",revision:null},{url:"assets/Flea-01-fnHrvhbM.jpg",revision:null},{url:"assets/Gaffer-00-oZuFyQeo.jpg",revision:null},{url:"assets/Gaffer-01-woUW279_.jpg",revision:null},{url:"assets/GB-S4-Alchemists-19-02-01-FSMtwsBJ.jpg",revision:null},{url:"assets/GB-S4-Alchemists-19-02-02-2q9reDWK.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-01-raCa_tqi.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-02-5QLgjM4G.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-04-EQtWIkGx.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-06-lMWPh8ks.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-08-eNfEa9SS.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-10-zoZxqpJ8.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-12-WZcGMrvb.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-14-x_it2P-a.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-16-GdVD6VCJ.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-18-8H0w6dKK.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-20-RVel1s5Z.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-22-BtT5WrwO.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-24-g2Ag5El-.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-26-vcTvXhdv.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-28-ODBNOpOl.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-30-420wAow_.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-31-U6IP3G7S.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-32-7otHQ0so.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-01-tWh6fF1J.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-02-bsNEneCo.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-03-XD6eAAss.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-04-CM_mQKEQ.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-06-qckS0uGX.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-08-6JtUtag0.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-10-TzpiL-Iq.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-12-u9Phffhj.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-14-WLAhuuJZ.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-16-RZqe3cCF.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-18-Jc7phndQ.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-20-x_CpLxXw.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-22-kTF75kA3.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-24-dLqZ_F-7.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-26-WQB09aut.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-28-CHVVmHvM.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-30-M6LuhZYI.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-32-ydDBEJN5.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-01-P255RnL2.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-02-AH-WhK0V.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-03-U6MJecgt.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-04-ogWoTHUm.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-06-QHJMh0Jp.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-08-AtUlbNIw.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-10-HTUfwCo9.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-12-Ac88Obez.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-14-1A8SZ565.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-16-ISyH3gL0.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-18-Nfd8YzlO.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-20-IbdAKkf_.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-22-wd5VoWma.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-24-Q13LWchQ.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-26-id6IXw_J.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-28-_2OgoR9I.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-30-Au6H70C9.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-32-qbN9femv.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-33-M6bN8voY.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-34-nWhbv0nS.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-01-i1iJV_Ex.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-02-hZTs1_2z.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-03-dW43Yd6z.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-04-kd1aNGgW.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-06-aQ11eyQl.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-08-T6Pvck3W.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-10-KYcZyqq6.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-12-dlg4NSbE.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-14-11hvCNpx.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-16-Yx3rC3tn.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-18-Or9aNiH7.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-20-SmsmvXUZ.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-22-9-44zhJB.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-24-1Li9WjNk.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-26-zkyQY6v6.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-28-DOjUtXHN.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-30-mU8eoC8Q.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-32-gxEyxReO.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-01-f1XdQ1Z1.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-02-Qkc8joVg.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-03-7vFoH_ee.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-04-O0D9CBM5.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-06--YfSFFgz.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-08-duy7sURW.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-10-YxBY0dqa.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-12-37plEuEN.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-14-NjSkFbDL.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-01-4vbt19Mb.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-02-stpTRS0a.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-03-mkzNcjzZ.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-04-TcL5Gv8t.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-06-K1NLMyfe.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-08-YWVuSu2y.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-10-I2Hl0USY.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-12-OTfbptKx.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-14-eseiX8TJ.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-16-nPRf_eA5.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-18-tOETUh63.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-20-K-LzslPk.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-22-x1wmOFpY.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-24--oUMa8x7.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-26-uYlzL2a4.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-28-O7s2Qpl3.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-30-G6fHN1H-.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-01-wDvNdlpb.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-02-v66OMzsv.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-03-Pq_GJbeQ.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-04-k-gV13fn.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-06-GoA6pejd.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-08-skcOa8Ia.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-10-NYReQ4GO.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-12-mTkaVLme.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-14--1hWYymp.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-01-C5ldsRVJ.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-02-jizhZ5QA.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-03-_Uv88toO.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-04--Ve0RgK4.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-06-rwupq8Sm.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-08-btnvVM6b.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-10-VUVY9PN4.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-12-Ne49_qRi.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-14-_UG1AwXs.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-16-Yubl1Ai4.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-18-mM2zoUVC.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-20-n5DtcBa2.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-22-JRvVvdms.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-24-Vm4nHksw.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-26-n7qNX2Yv.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-28-t0jB8VnV.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-30-t51I-gBL.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-32-38M8Vgq7.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-01--eHJWx7n.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-02-_8bwciRT.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-03-BxNsN3Iv.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-04-X1u-1dWW.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-06-Q8sTfOPQ.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-08-KJhEtdZO.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-10-RGOIvqkM.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-12-7-79zHg-.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-14-7j0K12z2.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-16-yyy0VQAS.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-18-mmiJDw_f.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-20-2TNyc9vM.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-22-4nIvudwx.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-24-ycjKLCl_.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-26-4GUJCcHG.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-28-avhkjPEw.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-30-bLgrEJXW.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-32-qNYrO0kY.jpg",revision:null},{url:"assets/GB-S4-Gameplans-2019-6ffU0NQa.png",revision:null},{url:"assets/GB-S4-Hunters-19-08-01-pg26TkW9.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-02-z-uFfdlL.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-03-ufXntuN8.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-04-ON24e145.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-06-73EDSYve.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-08-BtoiXsge.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-10-13NkuVEa.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-12-Yu5502RC.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-14-jhI5nDRG.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-16-_Aa62e1j.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-18-JvHTWKah.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-20-dP597nrw.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-22-5wYB_Ird.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-24-bbeCSFfR.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-26-oTiktUlc.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-28-B8TvdtYy.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-30-4OhC3Cxg.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-32-o8GW2T81.jpg",revision:null},{url:"assets/GB-S4-Masons-19-03-01-lNrxro9a.jpg",revision:null},{url:"assets/GB-S4-Masons-19-03-02-U--Qh4Sr.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-01-dhfqh8ke.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-02-g3t1DppP.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-04-CgzaDsKG.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-06-T6LtaN8h.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-08-sVK98HEC.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-10-fjQuqUBK.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-12-SykKY7kb.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-14-2B_regBF.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-16--CBWsJrj.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-18-ggWrrLqR.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-20-KHCKQDvB.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-22-uSp7bSPK.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-24-v_GiAuon.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-26-3yehH2BT.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-28-e0AWypSo.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-30-OpI4reGP.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-01--GEsghGi.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-02-KLBkX_Me.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-03-b6-19lTf.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-04-VLdQ-OLt.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-06-lgyTX8dV.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-08-7K8KcuZV.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-10-RbfEmrKL.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-12-9ULMUrfx.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-14-DpiGa6wl.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-01-yBQ-QytF.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-02-SKdfxFIC.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-03-RI0_4cTF.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-04-noZ0U2WX.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-06-fuNeIn7K.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-08-Putci_Qc.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-10-LeRi0TbN.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-12-JlnnlwZ0.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-14-2Aevggu0.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-16-1iR1YUEe.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-18-glDkk_UG.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-20-ttirWwq0.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-22-Lq00pB_L.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-24-7g2p-y11.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-26-BB0yLRSv.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-28-Ef6o-ewI.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-30--7YMJRB7.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-32-K1ittHaT.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-34-ppeyjRx0.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-01-DOzd0J5v.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-02-tA71C8uJ.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-03-7mNG4_Gy.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-04-ueIl3RyZ.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-05-4oz5FVNH.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-07-JNonz6fA.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-10-JMYL68BX.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-11-ywa595R7.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-14-OCyTP0AG.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-01-GrGZyqoU.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-02-8WMcCMn4.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-04-dTRyL0B8.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-06-cQkz9fJk.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-08-1i1gjQT6.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-10-nZrAtJO4.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-12-lJ5abgyK.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-14-Dds70HWJ.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-16-cRiBqBs0.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-18-IJI_LJBb.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-01-m1xwVCcS.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-02-F2wYzZlE.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-03-L3-Zf6XA.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-04-Z7881zxP.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-06-5ajdaPIv.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-08-cHIrmzlq.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-10-7UAq95Be.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-12-CVLNl5Ya.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-14-9SckSuXm.jpg",revision:null},{url:"assets/GB-S4-Reference-1-sd3gu3eJ.png",revision:null},{url:"assets/GB-S4-Reference-2-ieGIMh_d.png",revision:null},{url:"assets/GB-S4-Reference-3-U22aQedQ.png",revision:null},{url:"assets/GB-S4-Reference-4-qT-fE2qS.png",revision:null},{url:"assets/GB-S4-Reference-5-XvMY7Kdf.png",revision:null},{url:"assets/GB-S4-Shepherds-20-03-01-bMw8p-55.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-02-F6sC3pIq.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-03-ifhpy3pP.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-04-qSVGyCuR.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-06-E2TydSRE.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-08-Hz3RBarI.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-10-_LzTVTGo.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-12-rOnjXYLq.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-14-BETiz5dZ.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-16-h-895uOj.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-01-WFH_3DyC.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-02-gH1rqtZw.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-03-ckV-mX-u.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-04-xEiiCpXH.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-06-Ex_xYYZ7.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-08-vWnBuRso.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-10-UWZSTzVg.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-12-Pk3n5oIx.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-14-6E9HAQAv.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-16-6wyz02ST.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-18-G3ncl74Q.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-20-g3Fnwwae.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-22-xVZ7pxcW.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-24-08QN0hqu.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-26-aN6Sefea.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-28-oseHILx9.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-30-zj0MbDBV.jpg",revision:null},{url:"assets/gb-symbol-defs-71APP-OC.svg",revision:null},{url:"assets/heat_full-aQwfz4fL.jpg",revision:null},{url:"assets/heat-JINDXtK4.jpg",revision:null},{url:"assets/hook-00-QrcTkT9q.jpg",revision:null},{url:"assets/hook-01-hRF07KQ1.jpg",revision:null},{url:"assets/ikaros-00-ZSttwEFk.jpg",revision:null},{url:"assets/ikaros-01-mk1mK9xO.jpg",revision:null},{url:"assets/index-cyYDyqpu.css",revision:null},{url:"assets/index-hRG02_l6.js",revision:null},{url:"assets/lamp-beta-Otx5Vmnm.png",revision:null},{url:"assets/lamps_back_blank-2sT3fzqF.jpg",revision:null},{url:"assets/Locus-00-ZVGIii94.jpg",revision:null},{url:"assets/Locus-01-oCXkgASK.jpg",revision:null},{url:"assets/lucky-00-Pt8H9UPq.jpg",revision:null},{url:"assets/lucky-01-nhThJG--.jpg",revision:null},{url:"assets/lucky-J9wIxj86.svg",revision:null},{url:"assets/miasma-00-ICblSo9K.jpg",revision:null},{url:"assets/miasma-01-RaWSoNxx.jpg",revision:null},{url:"assets/minx-00-DT8Oqdc4.jpg",revision:null},{url:"assets/minx-01-IeALwHtj.jpg",revision:null},{url:"assets/nightlight_full-ErhmBPXi.jpg",revision:null},{url:"assets/nightlight_smallbox-sKmS2SAA.jpg",revision:null},{url:"assets/Order_back-KrHqTN94.jpg",revision:null},{url:"assets/phosphor_full-L5HfSGc5.jpg",revision:null},{url:"assets/phosphor_smallbox-rpYscqjM.jpg",revision:null},{url:"assets/playbook-symbol-defs-890LC9Sl.svg",revision:null},{url:"assets/Salt-00-04qWuFav.jpg",revision:null},{url:"assets/Salt-01-4F_t8Klz.jpg",revision:null},{url:"assets/soot_full-d5nuut23.jpg",revision:null},{url:"assets/soot-lxHLNgU8.jpg",revision:null},{url:"assets/steeljaw-00-wcpT-e2u.jpg",revision:null},{url:"assets/steeljaw-01-x73ZA97t.jpg",revision:null},{url:"assets/tenderiser-00-yXlo2Wgk.jpg",revision:null},{url:"assets/tenderiser-01-5-dwQqjC.jpg",revision:null},{url:"assets/Truffles-00-cUyCHkOA.jpg",revision:null},{url:"assets/Truffles-01-NcRsjCDr.jpg",revision:null},{url:"assets/Ulfr-00-V4ZRsZgL.jpg",revision:null},{url:"assets/Ulfr-01-CUH6HFXH.jpg",revision:null},{url:"assets/vGutter-00-qZzYfT-M.jpg",revision:null},{url:"assets/vGutter-01-Vh0ddt-G.jpg",revision:null},{url:"assets/wick_full-kQJx8jVk.jpg",revision:null},{url:"assets/wick-9dF2bssx.jpg",revision:null},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"data/gameplans.json",revision:"84197a88c0201e0335c7e8015c953c77"},{url:"data/GB-Playbook-4-3.json",revision:"b1cf4482673f7172f9ad25af7e28d7a4"},{url:"data/GB-Playbook-4-4.json",revision:"6fee13af1af317bddc1b58b04a7cb386"},{url:"data/GB-Playbook-4-5.json",revision:"2509ee5ae82238dfdab1c71c9989d97d"},{url:"data/manifest.json",revision:"783a14d0987d791a874dd741dbac9fad"},{url:"docs/GB-S4-FAQ-19-12-20.pdf",revision:"80fcbe4021495e7450e16801fcc033e7"},{url:"docs/GB-S4-RegionalCup-Rules-200128__1.pdf",revision:"c52ebc46e3233fa097e32b51ebf2c484"},{url:"docs/GB-S4-Rulebook-4.1.pdf",revision:"9524097439299f087a5f40f417f7b133"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"index.html",revision:"8dfe1c5a8437cd4c8b9dc2eca698dc8e"},{url:"manifest.webmanifest",revision:"a9121016eaef4c6c02585821c2e74f1a"},{url:"maskable-icon-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"maskable-icon-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"data/GB-Playbook-4-3.json",revision:"b1cf4482673f7172f9ad25af7e28d7a4"},{url:"data/GB-Playbook-4-4.json",revision:"6fee13af1af317bddc1b58b04a7cb386"},{url:"data/GB-Playbook-4-5.json",revision:"2509ee5ae82238dfdab1c71c9989d97d"},{url:"data/gameplans.json",revision:"84197a88c0201e0335c7e8015c953c77"},{url:"data/manifest.json",revision:"783a14d0987d791a874dd741dbac9fad"},{url:"docs/GB-S4-FAQ-19-12-20.pdf",revision:"80fcbe4021495e7450e16801fcc033e7"},{url:"docs/GB-S4-RegionalCup-Rules-200128__1.pdf",revision:"c52ebc46e3233fa097e32b51ebf2c484"},{url:"docs/GB-S4-Rulebook-4.1.pdf",revision:"9524097439299f087a5f40f417f7b133"},{url:"manifest.webmanifest",revision:"a9121016eaef4c6c02585821c2e74f1a"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new s.CacheFirst({cacheName:"gstatic-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
