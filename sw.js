if(!self.define){let s,e={};const l=(l,r)=>(l=new URL(l+".js",r).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(r,i)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let u={};const a=s=>l(s,n),o={module:{uri:n},exports:u,require:a};e[n]=Promise.all(r.map((s=>o[s]||a(s)))).then((s=>(i(...s),u)))}}define(["./workbox-f407626e"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"assets/Angel-00-c78d3301.jpg",revision:null},{url:"assets/Angel-01-9e233a83.jpg",revision:null},{url:"assets/beacon_full-b4520abb.jpg",revision:null},{url:"assets/beacon-c2199bf5.jpg",revision:null},{url:"assets/Blackheart-00-9e67b5f4.jpg",revision:null},{url:"assets/Blackheart-01-3447560f.jpg",revision:null},{url:"assets/Brisket-00-76d57987.jpg",revision:null},{url:"assets/Brisket-01-1822b8d1.jpg",revision:null},{url:"assets/brisket3-00-3adc6bc7.jpg",revision:null},{url:"assets/brisket3-01-7c83a13e.jpg",revision:null},{url:"assets/cast-00-15f5bf32.jpg",revision:null},{url:"assets/cast-01-6382e778.jpg",revision:null},{url:"assets/compound-7cf00764.svg",revision:null},{url:"assets/crook-00-18eef2f6.jpg",revision:null},{url:"assets/crook-01-216ebb94.jpg",revision:null},{url:"assets/egret-00-a4200aba.jpg",revision:null},{url:"assets/egret-01-7d3a1b58.jpg",revision:null},{url:"assets/Flea-00-5e92d53e.jpg",revision:null},{url:"assets/Flea-01-9a1f252f.jpg",revision:null},{url:"assets/Gaffer-00-683d08fe.jpg",revision:null},{url:"assets/Gaffer-01-4bba1ebf.jpg",revision:null},{url:"assets/GB-S4-Alchemists-19-02-01-b7207d3a.jpg",revision:null},{url:"assets/GB-S4-Alchemists-19-02-02-860c7142.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-01-07d774c8.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-02-249548d0.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-04-e3db7306.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-06-aa203c96.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-08-a6963f47.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-10-69500ecc.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-12-51d97a5c.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-14-e8369a06.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-16-845dde1e.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-18-ae076a1e.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-20-c5befc18.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-22-f3cfcff5.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-24-4b9b2b8d.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-26-63c05620.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-28-26c8eadb.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-30-a1e1550a.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-31-28ff27a7.jpg",revision:null},{url:"assets/GB-S4-Alchemists-20-03-32-941e3a9f.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-01-a493aa01.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-02-63a9ef55.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-03-af945f71.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-04-f6988358.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-06-11297112.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-08-3d13a355.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-10-50773ad4.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-12-e7d30bc0.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-14-692d6cde.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-16-fcd19be7.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-18-aa677c0d.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-20-9c9b52ed.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-22-a93cd941.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-24-4d1b456f.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-26-e5333c86.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-28-5d67c554.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-30-a9d5328c.jpg",revision:null},{url:"assets/GB-S4-Blacksmiths-20-03-32-b2ea32cf.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-01-e0c30916.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-02-250b71a7.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-03-31f11e6c.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-04-5902f654.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-06-ab3cd079.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-08-83d2515b.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-10-9422ed13.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-12-94c30f18.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-14-910049e5.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-16-71c22630.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-18-e6f3ec7f.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-20-e9bdab42.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-22-48884b17.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-24-81edfd69.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-26-7089e467.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-28-2895dd06.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-30-a1006310.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-32-cc7c6e74.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-33-42a5b128.jpg",revision:null},{url:"assets/GB-S4-Brewers-20-03-34-b8382606.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-01-6b5c9843.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-02-f72bc9bd.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-03-92ed9f6e.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-04-14d8bf06.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-06-fbf5e8aa.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-08-8fb6208a.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-10-e0b97a45.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-12-df5188e6.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-14-8d0a948b.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-16-145b24f3.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-18-98386980.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-20-4839ceac.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-22-b8596c9d.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-24-c1e75d69.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-26-bf18d2ec.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-28-c0168c85.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-30-f1dcea49.jpg",revision:null},{url:"assets/GB-S4-Butchers-19-08-32-648e938b.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-01-12229160.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-02-a5a86f06.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-03-60ae434a.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-04-0fc16519.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-06-5f70e59b.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-08-d2774f9e.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-10-7e3e3f4c.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-12-3205341c.jpg",revision:null},{url:"assets/GB-S4-Cooks-19-08-14-5238d099.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-01-e0791b3c.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-02-e56f64b9.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-03-375c07ef.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-04-680f4a50.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-06-1b622381.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-08-0bb1d858.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-10-7bd0b062.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-12-f5d405dd.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-14-d57961cb.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-16-55e363e8.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-18-403ef086.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-20-1b3369b0.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-22-7ee5824b.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-24-e1df77e7.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-26-562edcdd.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-28-496a034f.jpg",revision:null},{url:"assets/GB-S4-Engineers-20-03-30-4d31cb12.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-01-d57fd806.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-02-20d89347.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-03-dca190ed.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-04-b7e94bc7.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-06-3b353bde.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-08-db6e0fd9.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-10-631571ab.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-12-b501b86f.jpg",revision:null},{url:"assets/GB-S4-Falconers-20-03-14-fe48d097.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-01-e604843d.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-02-d2fc22ac.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-03-0e35c729.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-04-b9d98166.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-06-683146cd.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-08-2c6f46fe.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-10-452fbe06.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-12-714f2902.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-14-18caaf67.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-16-ff00ff61.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-18-ba3a9021.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-20-4a100f88.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-22-602ff1b6.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-24-66961623.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-26-03315cf3.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-28-8ad2e419.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-30-39b15227.jpg",revision:null},{url:"assets/GB-S4-Farmers-19-12-32-c14af351.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-01-56e804b2.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-02-b55c4205.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-03-1c13c527.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-04-27c9d93e.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-06-6a58a168.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-08-fd0b1bb0.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-10-ab5ea7b9.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-12-6f7c616f.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-14-a86fc3e2.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-16-ea99b3ab.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-18-263ad430.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-20-5610d144.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-22-2132042e.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-24-435c29ef.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-26-0ab59a15.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-28-46017279.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-30-c846672a.jpg",revision:null},{url:"assets/GB-S4-Fishermen-19-08-32-0ad636aa.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-01-69be7e34.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-02-a0ea2d8d.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-03-178b5e40.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-04-6c5f93ee.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-06-b2e07428.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-08-d014c6e6.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-10-2602111f.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-12-9e5e023c.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-14-d2baade5.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-16-d1a216e7.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-18-d3eb5644.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-20-78a9809f.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-22-672a06a6.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-24-f131cb91.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-26-c3a4cb76.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-28-302a6eb9.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-30-de998c39.jpg",revision:null},{url:"assets/GB-S4-Hunters-19-08-32-b35bbdb0.jpg",revision:null},{url:"assets/GB-S4-Masons-19-03-01-5046f323.jpg",revision:null},{url:"assets/GB-S4-Masons-19-03-02-d8a7f2a8.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-01-f24f3c0d.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-02-dab12926.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-04-76253b1b.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-06-99c0f3c1.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-08-05ead2d4.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-10-f8390c01.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-12-95bbca80.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-14-5ec4e9d6.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-16-7e36ec83.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-18-0525ad87.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-20-c69e8906.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-22-23aadec8.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-24-97392789.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-26-5433a60c.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-28-338aefa9.jpg",revision:null},{url:"assets/GB-S4-Masons-19-08-30-b62769af.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-01-1ef4e6eb.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-02-3238fa2b.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-03-91986abc.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-04-1035cbd0.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-06-08219b18.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-08-867355c6.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-10-9425fcd2.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-12-15dd9d6e.jpg",revision:null},{url:"assets/GB-S4-Miners-20-03-14-caa86f58.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-01-c9f81e6a.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-02-18e3ebb5.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-03-dec8c31c.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-04-58b88d4f.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-06-70f9e4da.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-08-bf28a261.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-10-b92161ad.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-12-edc3e641.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-14-3814181d.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-16-02d3017e.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-18-bb94bdd7.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-20-bf7b5045.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-22-16f3278e.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-24-e46db5c4.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-26-7ec5a4a3.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-28-21823cc9.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-30-3275f26e.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-32-597408cf.jpg",revision:null},{url:"assets/GB-S4-Morticians-19-08-34-d777bbba.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-01-d139e93c.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-02-a242b3da.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-03-cb4cb8e6.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-04-d4fa7092.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-05-50b9d291.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-07-6c494660.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-10-867c7d76.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-11-80667d92.jpg",revision:null},{url:"assets/GB-S4-Navigators-20-03-14-7752dbd8.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-01-d740fb3d.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-02-34b901c6.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-04-e1e467b1.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-06-044dbc8b.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-08-1736a0c1.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-10-76defc1c.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-12-c0856cd6.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-14-bbe76d68.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-16-f66e69df.jpg",revision:null},{url:"assets/GB-S4-Order-19-08-18-15f279f1.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-01-b3450652.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-02-757ae7fe.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-03-6dac58a0.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-04-40b91665.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-06-d0971de3.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-08-20fbaf7f.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-10-2ac65c8c.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-12-8b6301fe.jpg",revision:null},{url:"assets/GB-S4-Ratcatchers-19-08-14-0f2ee739.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-01-6ad6fccb.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-02-799f808c.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-03-b194ff03.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-04-c52d4b84.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-06-65b4ceb8.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-08-4c6abc56.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-10-5880b33c.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-12-c783bde5.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-14-be3f6f1e.jpg",revision:null},{url:"assets/GB-S4-Shepherds-20-03-16-1f0ead0c.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-01-b150fbb5.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-02-9468ca38.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-03-691f6840.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-04-bbe78504.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-06-89533045.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-08-0bae2b5a.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-10-f16d8d34.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-12-443f4ba2.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-14-eddd4282.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-16-bb7fb6da.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-18-67f3e618.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-20-488c190b.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-22-b7e68b4f.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-24-498ae001.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-26-d2b2b60c.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-28-ceb08302.jpg",revision:null},{url:"assets/GB-S4-Union-20-03-30-6c6bc380.jpg",revision:null},{url:"assets/gb-symbol-defs-68c95d21.svg",revision:null},{url:"assets/heat_full-7960f92b.jpg",revision:null},{url:"assets/heat-b2b10601.jpg",revision:null},{url:"assets/hook-00-d17add0c.jpg",revision:null},{url:"assets/hook-01-556bc5dd.jpg",revision:null},{url:"assets/ikaros-00-2a9f5e1f.jpg",revision:null},{url:"assets/ikaros-01-cd0310be.jpg",revision:null},{url:"assets/index-12f72a6c.css",revision:null},{url:"assets/index-efa66a4b.js",revision:null},{url:"assets/lamp-beta-dc0a4126.png",revision:null},{url:"assets/lamps_back_blank-f747d2af.jpg",revision:null},{url:"assets/Locus-00-5ecb3237.jpg",revision:null},{url:"assets/Locus-01-0c536d99.jpg",revision:null},{url:"assets/lucky-00-3a434443.jpg",revision:null},{url:"assets/lucky-01-670dfe13.jpg",revision:null},{url:"assets/lucky-acb1a9e3.svg",revision:null},{url:"assets/miasma-00-b4a862ea.jpg",revision:null},{url:"assets/miasma-01-60c346c1.jpg",revision:null},{url:"assets/minx-00-2977a711.jpg",revision:null},{url:"assets/minx-01-d2a3685f.jpg",revision:null},{url:"assets/nightlight_full-e1e4a611.jpg",revision:null},{url:"assets/nightlight_smallbox-18dedb7f.jpg",revision:null},{url:"assets/Order_back-fde9d244.jpg",revision:null},{url:"assets/phosphor_full-5d1f4c06.jpg",revision:null},{url:"assets/phosphor_smallbox-034b4964.jpg",revision:null},{url:"assets/playbook-symbol-defs-e8311c21.svg",revision:null},{url:"assets/Salt-00-cb8e6980.jpg",revision:null},{url:"assets/Salt-01-32a6b4f5.jpg",revision:null},{url:"assets/soot_full-b6c46b71.jpg",revision:null},{url:"assets/soot-02e73fd9.jpg",revision:null},{url:"assets/steeljaw-00-6825be2f.jpg",revision:null},{url:"assets/steeljaw-01-81980e9e.jpg",revision:null},{url:"assets/tenderiser-00-c64b4ad6.jpg",revision:null},{url:"assets/tenderiser-01-83195d52.jpg",revision:null},{url:"assets/Truffles-00-ac8ca7dd.jpg",revision:null},{url:"assets/Truffles-01-5a243c34.jpg",revision:null},{url:"assets/Ulfr-00-200976e4.jpg",revision:null},{url:"assets/Ulfr-01-084b8e8a.jpg",revision:null},{url:"assets/vGutter-00-515e674e.jpg",revision:null},{url:"assets/vGutter-01-ebf9a0af.jpg",revision:null},{url:"assets/wick_full-7d9ca130.jpg",revision:null},{url:"assets/wick-0d382943.jpg",revision:null},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"data/GB-Playbook-4-3.json",revision:"ebd64ea6f98faa5a77ec1464f9f213e4"},{url:"data/GB-Playbook-4-4.json",revision:"b23d3f382f67f5466a61a9bab89631eb"},{url:"data/GB-Playbook-4-5.json",revision:"a88269ed0652604a33476b9d8a0b5161"},{url:"data/manifest.json",revision:"c3fe1acbecc76946d321cf20d0921613"},{url:"docs/GB-S4-FAQ-19-12-20.pdf",revision:"80fcbe4021495e7450e16801fcc033e7"},{url:"docs/GB-S4-RegionalCup-Rules-200128__1.pdf",revision:"c52ebc46e3233fa097e32b51ebf2c484"},{url:"docs/GB-S4-Rulebook-4.1.pdf",revision:"9524097439299f087a5f40f417f7b133"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"index.html",revision:"37f4ac6bb25d9b273765578cf7eeb68e"},{url:"manifest.webmanifest",revision:"6cc9862ab06d4a5bbf7bae54dd9e4e31"},{url:"maskable-icon-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"pwa-64x64.png",revision:"ecb00646e770b9aa3e91cfb9909387c3"},{url:"CNAME",revision:"6b62f425122a80ff0107c2b9938f87b7"},{url:"apple-touch-icon-180x180.png",revision:"c6ade8d120b32268facbde0e632c86d4"},{url:"favicon.ico",revision:"4a2fe2fdcaa08f161283444598a8f468"},{url:"favicon.svg",revision:"6114c7937db75b09f50b3d31b2bd85d6"},{url:"maskable-icon-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"privacy.html",revision:"4eaf071255466ce08853754be78169ba"},{url:"pwa-192x192.png",revision:"6d64c647cd785e004c0be60bb1779d89"},{url:"pwa-512x512.png",revision:"d64c4db6a1dcdf625df901c1341ea41c"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"},{url:"data/GB-Playbook-4-3.json",revision:"ebd64ea6f98faa5a77ec1464f9f213e4"},{url:"data/GB-Playbook-4-4.json",revision:"b23d3f382f67f5466a61a9bab89631eb"},{url:"data/GB-Playbook-4-5.json",revision:"a88269ed0652604a33476b9d8a0b5161"},{url:"data/manifest.json",revision:"c3fe1acbecc76946d321cf20d0921613"},{url:"docs/GB-S4-FAQ-19-12-20.pdf",revision:"80fcbe4021495e7450e16801fcc033e7"},{url:"docs/GB-S4-RegionalCup-Rules-200128__1.pdf",revision:"c52ebc46e3233fa097e32b51ebf2c484"},{url:"docs/GB-S4-Rulebook-4.1.pdf",revision:"9524097439299f087a5f40f417f7b133"},{url:"manifest.webmanifest",revision:"6cc9862ab06d4a5bbf7bae54dd9e4e31"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new s.CacheFirst({cacheName:"gstatic-fonts-cache",plugins:[new s.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
