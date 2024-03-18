"use strict";(self.webpackChunkmy_ibax=self.webpackChunkmy_ibax||[]).push([[585],{135:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>f,frontMatter:()=>t,metadata:()=>c,toc:()=>l});var o=i(4848),r=i(8453);const t={},s="Server Configuration File {#server-configuration-file}",c={id:"reference/backend-config",title:"Server Configuration File",description:"server-configuration-file}",source:"@site/docs/reference/backend-config.md",sourceDirName:"reference",slug:"/reference/backend-config",permalink:"/docs/reference/backend-config",draft:!1,unlisted:!1,editUrl:"https://github.com/IBAX-io/docs/edit/main/docs/reference/backend-config.md",tags:[],version:"current",frontMatter:{},sidebar:"referenceSidebar",previous:{title:"RESTful API v2",permalink:"/docs/reference/api2"},next:{title:"Synchronized Monitoring Tool",permalink:"/docs/reference/desync_monitor"}},a={},l=[{value:"Introduction to the server configuration file",id:"introduction-to-the-server-configuration-file",level:2},{value:"Location",id:"location",level:2},{value:"Sections",id:"sections",level:2},{value:"An example configuration file",id:"an-example-configuration-file",level:2}];function d(e){const n={blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"server-configuration-file",children:"Server Configuration File"}),"\n",(0,o.jsx)(n.p,{children:"In this section, we will introduce parameters in the server configuration file."}),"\n",(0,o.jsx)(n.h2,{id:"introduction-to-the-server-configuration-file",children:"Introduction to the server configuration file"}),"\n",(0,o.jsx)(n.p,{children:"The server configuration file defines the node configuration of IBAX."}),"\n",(0,o.jsx)(n.h2,{id:"location",children:"Location"}),"\n",(0,o.jsxs)(n.p,{children:["This file is located in the working directory of the server and is named\n",(0,o.jsx)(n.code,{children:"config.toml"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"sections",children:"Sections"}),"\n",(0,o.jsx)(n.p,{children:"The configuration file consists the following sections:"}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"general section"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines the working directory DataDir, the first block directory\nFirstBlockPath and other parameters."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[TCPServer]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines the TCP service parameters."}),"\n",(0,o.jsx)(n.p,{children:"TCPServer is used for the network interaction between nodes."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[HTTP]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines the HTTP service parameters."}),"\n",(0,o.jsx)(n.p,{children:"HTTPServer provides RESTful APIs."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[DB]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines parameters of the PostgreSQL node database."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[StatsD]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines parameters of the node operation indicator collector StatsD."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[Centrifugo]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines parameters of the notification service Centrifugo."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[Log]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines parameters of the log service Log."}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsx)(n.p,{children:"[TokenMovement]"}),"\n"]}),"\n",(0,o.jsx)(n.p,{children:"It defines parameters of the token circulation service TokenMovement."}),"\n",(0,o.jsx)(n.h2,{id:"an-example-configuration-file",children:"An example configuration file"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-js",children:'PidFilePath = "/ibax-data/go-ibax.pid";\nLockFilePath = "/ibax-data/go-ibax.lock";\nDataDir = "/ibax-data";\nKeysDir = "/ibax-data";\nTempDir = "/var/folders/_l/9md_m4ms1651mf5pbng1y1xh0000gn/T/ibax-temp";\nFirstBlockPath = "/ibax-data/1block";\nTLS = false;\nTLSCert = "";\nTLSKey = "";\nOBSMode = "none";\nHTTPServerMaxBodySize = 1048576;\nMaxPageGenerationTime = 3000;\nNodesAddr = [][TCPServer];\nHost = "127.0.0.1";\nPort = (7078)[HTTP];\nHost = "127.0.0.1";\nPort = (7079)[DB];\nName = "ibax";\nHost = "127.0.0.1";\nPort = 5432;\nUser = "postgres";\nPassword = "123456";\nLockTimeout = (5000)[StatsD];\nHost = "127.0.0.1";\nPort = 8125;\nName = "ibax"[Centrifugo];\nSecret = "127.0.0.1";\nURL = "127.0.0.1"[Log];\nLogTo = "stdout";\nLogLevel = "ERROR";\nLogFormat = "text"[Log.Syslog];\nFacility = "kern";\nTag = "go-ibax"[TokenMovement];\nHost = "";\nPort = 0;\nUsername = "";\nPassword = "";\nTo = "";\nFrom = "";\nSubject = "";\n'})})]})}function f(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>c});var o=i(6540);const r={},t=o.createContext(r);function s(e){const n=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),o.createElement(t.Provider,{value:n},e.children)}}}]);