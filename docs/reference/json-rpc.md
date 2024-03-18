# JSON-RPC Application Programming Interface {#json-rpc-application-programming-interface}

In order for a software application to interact with the IBAX blockchain (fetch
block data or send transactions to the network), it must be connected to an IBAX
network node.

Due to the generality and extensibility of the original REST API interface, it
will become more and more complex with more and more interfaces and different
clients. We realize the importance of interface unification to ensure that all
clients can use the same set of specifications, regardless of the specific node
and client implementation.

JSON-RPC is a stateless, lightweight remote procedure call (RPC) protocol. It
defines a number of data structures and their processing rules. It is transport
independent, as these concepts can be used in the same process, via an
interface, hypertext transfer protocol, or in many different messaging
environments. It uses JSON (RFC 4627) as the data format.

JSON-RPC is compatible with most of the REST API interfaces, retaining the
original REST API interface, the client using the REST API interface can easily
transfer to the JSON-RPC interface, part of the interface:

- [`/data/{id}/data/{hash}`](api2.md#data-id-data-hash)
- [`/data/{table}/id/{column}/{hash}`](api2.md#data-table-id-column-hash)
- [`avatar/{ecosystem}/{member}`](api2.md#avatar-ecosystem-member)

Available through the REST API interface.

## Client-side implementation {#client-side-implementation}

Each client can use a different programming language when implementing the
JSON-RPC specification, and you can use the
[GO-SDK](https://github.com/IBAX-io/go-ibax-sdk)

## Curl example {#curl-example}

The following provides examples of using the JSON RPC API by making curl
requests to IBAX nodes. Each example includes a description of the particular
endpoint, its parameters, the return type, and a working example of how it
should be used.

Curl requests may return an error message related to the content type. This is
because the --data option sets the content type to
application/x-www-form-urlencoded. If your request has this problem, set the
header manually by placing -H "Content-Type: application/json" at the beginning
of the call. These examples also do not include the URL/Internet Protocol and
port combination that must be the last parameter of the curl (e.g.
127.0.0.1:7079). A full curl request with this additional data takes would be in
the following form:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.maxBlockId","params":[],"id":1}' http://127.0.0.1:7079
```

## Covenant {#covenant}

### Hex {#hex}

**Hexadecimal code**

When encoding byte arrays, hashes, and bytecode arrays: the encoding is
hexadecimal, two hexadecimal digits per byte.

### Request type {#request-type}

**Uniform use**

- Content-Type: application/json

### Special markers {#special-markers}

#### Omitempty {#omitempty}

This field is an optional parameter.

If there are multiple `Omitempty` fields in a row, but only want to pass the
value of a certain field, then you need to set the unwanted field to null (the
field type null value), Example:

- **id** - _Number_ - [Omitempty](#omitempty) id
- **name** - _String_ - [Omitempty](#omitempty) Name
- **column** - _String_ - [Omitempty](#omitempty) Filter column names

If only the name value is passed, then the request parameters are passed as
follows

`"params":[0, "testname"]` - _Number_ null value is 0

If only the column value is passed, then the request parameters are passed as
follows

`"params":[0,"", "title,page"]` - _String_ empty value for ""

#### Authorization {#authorization}

Authorization header, add Authorization to the request header, example:

**name** : Authorization **value** : Bearer +[login token](#ibax-login)

Example:

```bash
//request
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ey...." -d '{"jsonrpc":"2.0","method":"ibax.getContractInfo","params":["@1TokensSend"],"id":1}' http://127.0.0.1:7079
```

#### AccountOrKeyId {#accountorkeyid}

For the account address parameter, you can use two formats of addresses, for
example:

1. - _String_ - Account Address `"XXXX-XXXX-XXXX-XXXX-XXXX"` or Account Id
     `"64842...538120"` .538120"`

2. - _Object_ - Address object
   - **key_id** - _Number_ - Account Id, Example: `{"key_id":-64842...38120}`
   - **account** - _String_ - Account address, Example:
     `{"account": "1196-...-...-...-3496"}`

   **Account Id is preferred when both account address and account Id exist**.

#### BlockOrHash {#blockorhash}

Block height or block HASH, example:

1. - _String_ - Block Height `"100"` or Block
     HASH`"4663aa47...a60753c18d9ba9cb4"`

2. - _Object_ - Block information object

     - **id** - _Number_ - block height, example: `{"id":2}`
     - **hash** - _[Hex](#hex) String_ - Block HASH, Example:
       `{"hash": "d36b8996c...c616d3043a0d02a0f59"}`

     **Block Height and Block HASH can only choose one**.

### Batch requests {#batch-requests}

This feature can be used to reduce network latency, especially when acquiring a
large number of largely independent data objects.

The following is an example of obtaining the highest block and total number of
transactions:

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '[{"jsonrpc":"2.0","method":"ibax.getTxCount","id":1,"params":[]},{"jsonrpc":"2.0","method":"ibax.maxBlockId","id":2,"params":[]}]' http://127.0.0.1:7079

    //Response
    [
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": 149100
        },
        {
            "jsonrpc": "2.0",
            "id": 2,
            "result": 797
        }
    ]
```

### Error response handling {#error-response-handling}

Returns status `200` in case the request is executed successfully.

If an error occurs, a JSON object with the following fields will be returned:

- jsonrpc

  Error identifier.

- id

  Error text message.

- error

  - code

    Response Status Code

  - message

    Response Status Description

```text
{
    "jsonrpc": "2.0",
    "id": 1,
    "error": {
        "code": -32014,
        "message": "Unauthorized"
    }
}
```

## JSON-RPC Namespaces {#json-rpc-namespaces}

### ibax Namespace {#ibax-namespace}

#### Authentication Interface {#authentication-interface}

- [ibax.getuid](#ibax-getuid)
- [ibax.login](#ibax-login)
- [ibax.getAuthStatus](#ibax-getauthstatus)

#### server-side command interface {#server-side-command-interface}

- [ibax.getVersion](#ibax-getversion)

#### Data Request Function Interface {#data-request-function-interface}

- [ibax.getBalance](#ibax-getbalance)
- [ibax.getBlocksTxInfo](#ibax-getblockstxinfo)
- [ibax.detailedBlocks](#ibax-detailedblocks)
- [ibax.getKeyInfo](#ibax-getkeyinfo)
- [ibax.detailedBlock](#ibax-detailedblock)

#### Get Metrics Interface {#get-metrics-interface}

- [ibax.maxBlockId](#ibax-maxblockid)
- [ibax.getKeysCount](#ibax-getkeyscount)
- [ibax.getTxCount](#ibax-gettxcount)
- [ibax.getTransactionCount](#ibax-gettransactioncount)
- [ibax.getBlocksCountByNode](#ibax-getblockscountbynode)
- [ibax.honorNodesCount](#ibax-honornodescount)
- [ibax.getEcosystemCount](#ibax-getecosystemcount)

#### Ecosystem Interface {#ecosystem-interface}

- [ibax.ecosystemInfo](#ibax-ecosysteminfo)
- [ibax.appParams](#ibax-appparams)
- [ibax.getEcosystemParams](#ibax-getecosystemparams)
- [ibax.getTableCount](#ibax-gettablecount)
- [ibax.getTable](#ibax-gettable)
- [ibax.getList](#ibax-getlist)
- [ibax.getSections](#ibax-getsections)
- [ibax.getRow](#ibax-getrow)
- [ibax.systemParams](#ibax-systemparams)
- [ibax.history](#ibax-history)
- [ibax.getPageRow](#ibax-getpagerow)
- [ibax.getMenuRow](#ibax-getmenurow)
- [ibax.getSnippetRow](#ibax-getsnippetrow)
- [ibax.getAppContent](#ibax-getappcontent)
- [ibax.getMember](#ibax-getmember)

#### Contract Function Interface {#contract-function-interface}

- [ibax.getContracts](#ibax-getcontracts)
- [ibax.getContractInfo](#ibax-getcontractinfo)
- [ibax.sendTx](#ibax-sendtx)
- [ibax.txStatus](#ibax-txstatus)
- [ibax.txInfo](#ibax-txinfo)
- [ibax.txInfoMultiple](#ibax-txinfomultiple)
- [ibax.getPageValidatorsCount](#ibax-getpagevalidatorscount)
- [ibax.getPage](#ibax-getpage)
- [ibax.getMenu](#ibax-getmenu)
- [ibax.getSource](#ibax-getsource)
- [ibax.getPageHash](#ibax-getpagehash)
- [ibax.getContent](#ibax-getcontent)
- [ibax.getBlockInfo](#ibax-getblockinfo)
- [ibax.getConfig](#ibax-getconfig)

### net Namespace {#net-namespace}

- [net.getNetwork](#net-getnetwork)
- [net.status](#net-status)

### rpc Namespace {#rpc-namespace}

- [rpc.modules](#rpc-modules)

### admin Namespace {#admin-namespace}

- [admin.startJsonRpc](#admin-startjsonrpc)
- [admin.stopJsonRpc](#admin-stopjsonrpc)

### debug Namespace {#debug-namespace}

- [debug.getNodeBanStat](#debug-getnodebanstat)
- [debug.getMemStat](#debug-getmemstat)

## JSON-RPC Interface Methods {#json-rpc-interface-methods}

### **ibax.getUid** {#ibax-getuid}

[Authorization](#authorization) [Omitempty](#omitempty)

Generate a temporary JWT token, which needs to be passed to
[**Authorization**](#authorization) when calling **[login](#ibax-login)**.

**Parameters**

- None

**Return Value**

- **uid** - _String_ - The signature number.

- **token** - _String_ - temporary token passed during login (temporary token
  has a 5 second lifespan).

- **network_id** - _String_ - The network identifier.

- **cryptoer** - _String_ - Elliptic curve algorithm.

- **hasher** - _String_ - hash algorithm.

In the case that no authorization is required(the request contains
[Authorization](#authorization), the following message will be returned.

- **expire** - _String_ - Expiration time.

- **ecosystem** - _String_ - Ecosystem ID.

- **key_id** - _String_ - The account address.

- **address** - _String_ - wallet address `XXXX-XXXXXX-XXXX-XXXX-XXXX`.

- **network_id** - _String_ - The network identifier.

**Example**

```text
    //Request1
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getUid","params":[],"id":1}' http://127.0.0.1:7079

    //Response1
     {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "uid": "5823391950439015186",
            "token": "ey....",
            "network_id": "1",
            "cryptoer": "ECC_Secp256k1",
            "hasher": "KECCAK256"
        }
    }

    //Request2
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ey...." -d '{"jsonrpc":"2.0","method":"ibax.getUid","params":[],"id":1}' http://127.0.0.1:7079

    //Response2
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "expire": "7h59m49.5361126s",
            "ecosystem_id": "1",
            "key_id": "6667782293976713160",
            "address": "0666-7782-2939-7671-3160",
            "network_id": "1",
            "cryptoer": "ECC_Secp256k1",
            "hasher": "KECCAK256"
        }
    }
```

### **ibax.login** {#ibax-login}

User authentication.

[Authorization](#authorization)

The [**ibax.getUid**](#ibax-getuid) command should be called first in order to
receive the unique value and sign it.

The temporary JWT token for getuid needs to be passed in the request header.

If the request is successful, the token received in the response is contained in
[**Authorization**](#authorization).

**Parameters**

_Object_ - Authentication call object

- **ecosystem_id** - _Number_ - Ecosystem ID. if not specified, defaults to the
  first ecosystem ID.

- **expire** - _Number_ - The lifecycle of the JWT token in seconds, default is
  28800,8 hours.

- **public_key** - _[Hex](#hex) String_ - Hexadecimal account public key.

- **key_id** - _String_ -

  > Account address `XXXX-... -XXXX`.
  >
  > Use this parameter if the public key is already stored in the blockchain. It
  > cannot be used with _pubkey_ parameters are used together.

- **signature** - _String_ -

  Use the private key to sign the uid received by getuid.

  Signature data content: `LOGIN`+`{$network_id}`+`uid`

- **role_id** - _Number_ - Role ID, default role 0

**Return Value** _Object_ - Authentication object

- **token** - _String_ - JWT token.

- **ecosystem_id** - _String_ - Ecosystem ID.

- **key_id** - _String_ - Account Address ID

- **account** - _String_ - wallet address `XXXX-XXXXXX-XXXX-XXXX-XXXX`.

- **notify_key** - _String_ - The notification ID.

- **isnode** - _Bool_ - Whether the account address is the owner of the node.
  Values: `true,false`.

- **isowner** - _Bool_ - Whether the account address is the creator of this
  ecosystem. Values: `true,false`.

- **clb** - _Bool_ - Whether the logged-in ecosystem is a CLB. Values:
  `true,false`.

- **timestamp** - _String_ - current timestamp

- **roles** - _Array_ list of roles, if there are no roles, the field is nil
  - **role_id** - _Number_ - Role ID
  - **role_name** - _String_ - Role name

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.login","params":[{"ecosystem_id":1,"public_key":"04....","signature","46...","role_id":0}],"id":1}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "token": "ey...",
            "ecosystem_id": "1",
            "key_id": "6660819716178795186",
            "account": "0666-xxxx-xxxx-xxxx-5186",
            "notify_key": "ey....",
            "isnode": false,
            "isowner": false,
            "clb": false,
            "timestamp": "1678336163",
            "roles": nil //[{"role_id": 1, "role_name": "Developer"},{"role_id": 2, "role_name": "DevelopGovernancerer"}]
        }
    }
```

### **ibax.getAuthStatus** {#ibax-getauthstatus}

User authentication status.

[Authorization](#authorization)

**Parameters**

- None

**Return Value** _Object_ - Authentication status object

- **active** - _Bool_ - The current user authentication status. Values:
  `true,false`

- **exp** - _Number_ - [Omitempty](#omitempty) Token validity cutoff timestamp

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getAuthStatus","id":1}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "active": true,
            "exp": 1678354136
        }
    }
```

### **ibax.getVersion** {#ibax-getversion}

Returns the current server version.

**Parameters**

- None

**Return Value**

- **vesion** - _String_ - version number (`big Version` + `branch name` +
  `git commit` + `time` + `node status`)

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getVersion","id":1}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": "1.3.0 branch.main commit.b57d4194 time.2023-03-08-09:30:29(UTC) node server status is running"
    }
```

### **ibax.getBalance** {#ibax-getbalance}

Get the account address balance.

**Parameters**

- **key_id or account** - [_AccountOrKeyId_](#accountorkeyid) - account address
  `XXXX- XXXX-XXXX-XXXX-XXXX` or account ID

- **ecosystem_id** - _Number_ - Ecosystem ID [Omitempty](#omitempty) Default 1

**Return Value** _Object_ - Get the balance object

- **amount** - _String_ - the minimum unit of the contract account balance.

- **total** - _String_ - the total balance of the minimum unit account (amount +
  utxo).

- **utxo** - _String_ - Minimum unit UTXO account balance.

- **digits** - _Number_ - Accuracy

- **token_symbol** - _String_ - Token symbols

**Example**

```text
    //Request1
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getBalance","id":1,"params":["648...8120"]}' http://127.0.0.1:7079

    //Request2
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getBalance","id":1,"params":["1196-...-...-...-3496",1]}' http://127.0.0.1:7079

    //Request3
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getBalance","id":1,"params":[{"key_id":{$key_id}},1]}' http://127.0.0.1:7079 //keyId or account

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "amount": "9915319240441612",
            "digits": 12,
            "total": "9915319240441612",
            "utxo": "0",
            "token_symbol": "IBXC"
        }
    }
```

### **ibax.getBlocksTxInfo** {#ibax-getblockstxinfo}

Returns a list containing additional information about the transactions in each
block.

**Parameters**

- **block_id** - _Number_ - the starting block height to query

- **count** - _Number_ - number of blocks, default is 25, maximum request is 100

**Return Value** _Object_ - Get the block information object.

- **block_id** - _String_ - block height
- List of transactions in the block and additional information for each
  transaction:

  - **hash** - _[Hex](#hex) String_ - The transaction hash.

  - **contract_name** - _String_ - The name of the contract.

  - **params** - _Object_ - contract parameters, contract fields can be queried
    via [ibax.getContractInfo](#ibax-getcontractinfo).

  - **key_id** - _Number_ -

    For the first block, it is the account address of the first block that
    signed the transaction.

    For all other blocks, it is the address of the account that signed the
    transaction.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getBlocksTxInfo","id":1,"params":[1,2]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "1": [ //block_id
                {
                    "hash": "uXSaSrMWlbHpNlu049J5BDypC6MzBQ0/5VEfGQf+5aQ=",
                    "contract_name": "",
                    "params": null,
                    "key_id": 6667782293976713160
                }
            ],
            "2": [ //block_id
                {
                    "hash": "r8U9IKjtZ5Be5D4ak3zxLlDwn36CTdfIAsVvQhx7P3w=",
                    "contract_name": "@1NewUser",
                    "params": {
                        "Ecosystem": 1,
                        "NewPubkey": "d11ea197fe23152562c6f54c46335d9093f245ab5d22b13ff3e0e2132dc9ff38da77aa093945280c4cf5ad9e889c074dfd9080099982d8b2d4d100315e1cebc7"
                    },
                    "key_id": 6667782293976713160
                }
            ]
        }
    }
```

### **ibax.detailedBlocks** {#ibax-detailedblocks}

Returns a list containing detailed additional information about the transactions
in each block.

**Parameters**

- **block_id** - _Number_ - the height of the starting block to query

- **count** - _Number_ - number of blocks, default is 25, maximum request is 100

**Return Value** _Object_ - Get the block details object.

- **block_id** - _String_ - block height
  - **header** - _Object_ - block header The block header contains the following
    fields.
    - **block_id** - _Number_ - the height of the block.
    - **time** - _Number_ - block generation timestamp.
    - **key_id** - _Number_ - the address of the account that signed the block.
    - **node_position** - _Number_ - The position of the node that generated the
      block in the honor node list.
    - **version** - _Number_ - the block structure version.
  - **hash** - _[Hex](#hex) String_ - The block hash.
  - **node_position** - _Number_ - The position of the node that generated the
    block in the honor node list.
  - **key_id** - _Number_ - the address of the account that signed the block.
  - **time** - _Number_ - block generation timestamp.
  - **tx_count** - _Number_ - the number of transactions within the block.
  - **size** - _String_ - the size of the block.
  - **rollback_hash** - _[Hex](#hex) String_ - The block rollback hash.
  - **merkle_root** - _[Hex](#hex) String_ - The merkle tree for this block
    transaction.
  - **bin_data** - _[Hex](#hex) String_ - Serialization of the block header, all
    transactions within the block, the previous block hash, and the private key
    of the node that generated the block.
  - **transactions** - _Object_ - Transactions List of transactions in the block
    and additional information about each transaction:
    - **hash** - _[Hex](#hex) String_ - The transaction hash.
    - **contract_name** - _String_ - The name of the contract.
    - **params** - _Object_ - contract parameters, contract fields can be
      queried via [ibax.getContractInfo](#ibax-getcontractinfo).
    - **key_id** - _Number_ - The address of the account that signed the
      transaction.
    - **time** - _Number_ - transaction generation timestamp (unit: ms).
    - **type** - _Number_ - the type of the transaction.
    - **size** - _String_ - The transaction size.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.detailedBlocks","id":1,"params":[1,2]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "1": { //block id
                "header": {
                    "block_id": 1,
                    "time": 1676512422,
                    "key_id": 6667782293976713160,
                    "node_position": 0,
                    "version": 3
                },
                "hash": "0d7d51b4c14bacbf45d812f73497ede8f22d678bc4be6e6848193f3b7262ac91",
                "node_position": 0,
                "key_id": 6667782293976713160,
                "time": 1676512422,
                "tx_count": 1,
                "size": "660.00B",
                "rollbacks_hash": "1a829923f2c9b1e259fdfb42cc1bc255e144dbfb352af7e072d0b9d61a94df15",
                "merkle_root": "36373332663064383331353264316333653639346431656436383734373634363463616363616564636632353232646335633736643066623737343931366363",
                "bin_data": "Cp4BCAEQppm...",
                "stop_count": 0,
                "transactions": [
                    {
                        "hash": "b9749a4ab31695b1e9365bb4e3d279043ca90ba333050d3fe5511f1907fee5a4",
                        "contract_name": "",
                        "params": null,
                        "key_id": 6667782293976713160,
                        "time": 1676512422406,
                        "type": 1,
                        "size": "250.00B"
                    }
                ]
            },
            "2": { //block id
                "header": {
                    "block_id": 2,
                    "time": 1676536235,
                    "key_id": 6667782293976713160,
                    "node_position": 0,
                    "version": 3
                },
                "hash": "dd13a30661d35e01df82027a6e6607eb47ee00765d69767dbb99e151676c2c96",
                "node_position": 0,
                "key_id": 6667782293976713160,
                "time": 1676536235,
                "tx_count": 1,
                "size": "1.53KiB",
                "rollbacks_hash": "9041312d69e6bcd37c91a2bfa066abaeb53b8398708937a618a89960bfadab3d",
                "merkle_root": "65366537383931353662613230356565396466353061316538656538643636323332316636616265623764633539616166346635343030383135386538643130",
                "bin_data": "Cp4BCAIQq9O...",
                "stop_count": 0,
                "transactions": [
                    {
                        "hash": "afc53d20a8ed67905ee43e1a937cf12e50f09f7e824dd7c802c56f421c7b3f7c",
                        "contract_name": "@1NewUser",
                        "params": {
                            "Ecosystem": 1,
                            "NewPubkey": "d11ea197fe23152562c6f54c46335d9093f245ab5d22b13ff3e0e2132dc9ff38da77aa093945280c4cf5ad9e889c074dfd9080099982d8b2d4d100315e1cebc7"
                        },
                        "key_id": 6667782293976713160,
                        "time": 1676536233945,
                        "type": 3,
                        "size": "390.00B"
                    }
                ]
            }
        }
    }
```

### **ibax.getKeyInfo** {#ibax-getkeyinfo}

Returns a list of ecosystems with roles that are registered to the specified
address.

**Parameters**

- **account** - _String_ - Account Address

**Return Value** _Object_ - Specify the address eco-list object

- **account** - _String_ - Account Address
- **ecosystems** - _Array_ - Eco-List
  - **ecosystem** - _String_ - Ecosystem id
  - **name** - _String_ - Ecosystem name
  - **digits** - _Number_ - Accuracy
  - **roles** - _Array_ - list of roles.
    - **id** - _String_ - role id
    - **name** - _String_ - Character name

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getKeyInfo","id":1,"params":["0666-XXXX-XXXX-XXXX-5186"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "account": "0666-XXXX-XXXX-XXXX-5186",
            "ecosystems": [
                {
                    "ecosystem": "1",
                    "name": "platform ecosystem",
                    "digits": 12,
                    "roles": [
                        {
                            "id": "1",
                            "name": "Developer"
                        },
                        {
                            "id": "2",
                            "name": "Governancer"
                        }
                    ]
                }
            ]
        }
    }
```

### **ibax.detailedBlock** {#ibax-detailedblock}

Returns a detailed list of additional information about the transactions in the
block.

**Parameters**

- **Block or Hash** - _[BlockOrHash](#blockorhash)_ - Block Height or Block Hash

**Return Value** _Object_ - Get the block details object

- **header** - _Object_ - block header The block header contains the following
  fields.

  - **block_id** - _Number_ - the height of the block.
  - **time** - _Number_ - block generation timestamp.
  - **key_id** - _Number_ - the address of the account that signed the block.
  - **node_position** - _Number_ - The position of the node that generated the
    block in the honor node list.
  - **version** - _Number_ - the block structure version.

- **hash** - _[Hex](#hex) String_ - The block hash.
- **node_position** - _Number_ - The position of the node that generated the
  block in the honor node list.
- **key_id** - _Number_ - the address of the account that signed the block.
- **time** - _Number_ - block generation timestamp.
- **tx_count** - _Number_ - the number of transactions within the block.
- **size** - _String_ - the size of the block.
- **rollback_hash** - _[Hex](#hex) String_ - The block rollback hash.
- **merkle_root** - _[Hex](#hex) String_ - The merkle tree for this block
  transaction.
- **bin_data** - _[Hex](#hex) String_ - Serialization of the block header, all
  transactions within the block, the previous block hash, and the private key of
  the node that generated the block.
- **transactions** - _Array_ - Transactions List of transactions in the block
  and additional information about each transaction:
  - **hash** - _[Hex](#hex) String_ - The transaction hash.
  - **contract_name** - _String_ - The name of the contract.
  - **params** - _Object_ - contract parameters, contract fields can be queried
    via [ibax.getContractInfo](#ibax-getcontractinfo).
  - **key_id** - _Number_ - The address of the account that signed the
    transaction.
  - **time** - _Number_ - transaction generation timestamp (unit: ms).
  - **type** - _Number_ - the type of the transaction.
  - **size** - _String_ - The transaction size.

**Example**

```text
    //Request1
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.detailedBlock","id":1,"params":["1"]}' http://127.0.0.1:7079

    //Request2
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.detailedBlock","id":1,"params":["0d7d51b4c14bacbf45d812f7349...e6e6848193f3b7262ac91"]}' http://127.0.0.1:7079

    //Request3
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.detailedBlock","id":1,"params":[{"id":1}]}' http://127.0.0.1:7079


    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "header": {
                "block_id": 1,
                "time": 1676512422,
                "key_id": 6667782293976713160,
                "node_position": 0,
                "version": 3
            },
            "hash": "0d7d51b4c14bacbf45d812f7349...e6e6848193f3b7262ac91",
            "node_position": 0,
            "key_id": 6667782293976713160,
            "time": 1676512422,
            "tx_count": 1,
            "size": "660.00B",
            "rollbacks_hash": "1a829923f2c9b1e259fdfb42cc1bc255e144dbfb352af7e072d0b9d61a94df15",
            "merkle_root": "3637333266306438333135...623737343931366363",
            "bin_data": "Cp4BCAEQppm2nwYgyI/8gLSVrsRcMkAFGTK6nxD86hfhgQX0dWzO8aYZExDN9UPm8sKkqeUbwrNliYuCJHvvdX+txINnM7+gDqtMF/1K43kc0gYC0u8uOiANfVG0wUusv0XYEvc0l+3o8i1ni8S+bmhIGT87cmKskUIgBEhSsqZwreVAfnj7KGPFHen8uWVCoHGG/jrtpruKEW1IA1ABYAESRDogQBBdW8EBBcF/1yuTqPczaeLubu5NRxS3v3vzwvFW5gFCIARIUrKmcK3lQH54+yhjxR3p/LllQqBxhv467aa7ihFtGkA2NzMyZjBkODMxNTJkMWMzZTY5NGQxZWQ2ODc0NzY0NjRjYWNjYWVkY2YyNTIyZGM1Yzc2ZDBmYjc3NDkxNmNjKugCeJxibFvmk5+enlp0YK1LUkhRYl5xYnJJZn7egSUuiSWJ7Uu9Uys9XS7HdOxY7SDPfmJJSGZu6mUGBgaG5Lc9y1YGlCblZCZ7p1YecejvOPzyp63tWeYpWS+nxBTv3biTOUTqg7vfgedPuXdbnjsmYX49a9mXA025NT4TbjQ65bQwbloQcjbQRG3ZudjjUxuL1/rlp6QimTfLcZNH0o/bie/SfiskTNm1tPrfmrrlbdfMklamXHR53XpxwSODSb1hX3Kvyb1fU+awbZVG8yaXmGqtO3wR8jPsP6y7vTW4JL/AL7WkPL8o2zm1qMSpNC8lJ/XAkpDU4hKwBxgYGBg3BhRlliWWpDrl5CdnJ2ckZuadh0oxrAT5tLgkMbfgMgMDY1v42yy2ZSEVHonFGUcUdpbM8tosNnXjS7PoLY8vVbLYrORebMzKa/80UF6S/d/TJcsDEitz8hNTjvwaueEHCAAA//+pZRGv",
            "stop_count": 0,
            "transactions": [
                {
                    "hash": "b9749a4ab31695b1e9365bb4e3d279043ca90ba333050d3fe5511f1907fee5a4",
                    "contract_name": "",
                    "params": null,
                    "key_id": 6667782293976713160,
                    "time": 1676512422406,
                    "type": 1,
                    "size": "250.00B"
                }
            ]
        }
    }
```

### **ibax.maxBlockId** {#ibax-maxblockid}

Get the highest block ID on the current node

**Parameters**

- None

**Return Value**

- **Block Id** - _Number_ - The highest block on the current node

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.maxBlockId","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": 774
    }
```

### **ibax.getKeysCount** {#ibax-getkeyscount}

Get the total number of addresses on the current node

**Parameters**

- None

**Return Value**

- **Count** - _Number_ - Total number of addresses

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getKeysCount","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": 11
    }
```

### **ibax.getTxCount** {#ibax-gettxcount}

Get the total number of transactions in the current node

**Parameters**

- None

**Return Value**

- **Count** - _Number_ - Total number of transactions

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getTxCount","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": 149068
    }
```

### **ibax.getTransactionCount** {#ibax-gettransactioncount}

Get the number of block transactions

**Parameters**

- **block or hash** - _[BlockOrHash](#blockorhash)_ - block height or block hash

**Return Value**

- **Count** - _Number_ - Total number of blocks

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getTransactionCount","id":1,"params":["efc386f7573269610a34af9cc722f775cca8183ccaa0ed7a96db61ef0bde6d1c"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": 337
    }
```

### **ibax.getBlocksCountByNode** {#ibax-getblockscountbynode}

Get the number of node location packing blocks **Parameters**

- **nodePosition** - _Number_ - node subscript

- **consensusMode** - _Number_ - Consensus Mode, parameters (1: Creator
  Management Mode 2: DAO Governance Mode)

**Return Value** _Object_ - Get the node subscript packing number object

- **total_count** - _Number_ - Total number of blocks

- **partial_count** - _Number_ - Number of node subscript packing blocks

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getBlocksCountByNode","id":1,"params":[0,1]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "total_count": 774,
            "partial_count": 774
        }
    }
```

### **ibax.honorNodesCount** {#ibax-honornodescount}

Get number of honor nodes

**Parameters**

- None

**Return Value**

- **Count** - _Number_ - number of nodes

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.honorNodesCount","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": 1
    }
```

### **ibax.getEcosystemCount** {#ibax-getecosystemcount}

Number of ecosystem acquisitions

**Parameters**

- None

**Return Value**

- **Count** - _Number_ - Ecosystem number

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getEcosystemCount","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": 2
    }
```

### **ibax.ecosystemInfo** {#ibax-ecosysteminfo}

Access to ecosystem information

**Parameters**

- **ecosystem id** - _Number_ - ecosystem ID

**Return Value**

- **id** - _Number_ - Eco-ID
- **name** - _String_ - Ecosystem name
- **digits** - _Number_ - Accuracy
- **token_symbol** - _String_ - Token symbols
- **token_name** - _String_ - the name of the token
- **total_amount** - _String_ - the number of issues (first issue, or `"0"` if
  not issued)
- **is_withdraw** - _Bool_ - destructible
  `true:destructible false:undestructible`
- **withdraw** - _String_ - amount of destruction (`"0"` if not destructible, or
  not destroyed)
- **is_emission** - _Bool_ - may be incremented
  `true:may be incremented false:may not be incremented`
- **emission** - _String_ - increment (`"0"` if no increment is available, or if
  no increment is available)
- **introduction** - _String_ - Eco Introduction
- **logo** - _Number_ - ecoLogo Id (corresponds to Binary table id), available
  through the RESTFUL API
- **creator** - _String_ - Eco-creator

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.ecosystemInfo","id":1,"params":[1]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 2,
        "result": {
            "id": 5,
            "name": "test name",
            "digits": 6,
            "token_symbol": "test",
            "token_name": "test Coin",
            "total_amount": "10000",
            "is_withdraw": true,
            "withdraw": "100000000000900000",
            "is_emission": true,
            "emission": "100000000001000000",
            "introduction": "this is a test introduction",
            "logo": 6,
            "creator": "0666-0819-7161-7879-5186"
        }
    }
```

### **ibax.appParams** {#ibax-appparams}

Returns a list of application parameters in the current or specified ecosystem

[Authorization](#authorization)

**Parameters**

- **appid** - _Number_ - the application ID.

- **ecosystem** - _Number_ - [Omitempty](#omitempty) - Ecosystem ID;

  If unspecified or 0, the parameters of the current ecosystem will be returned.

- **names** - _String_ - [Omitempty](#omitempty) - Filter the application
  parameter names.

  A comma-separated list of names, e.g.: `name1,name2`.

- **offset** - _Number_ - [Omitempty](#omitempty) The offset, default is 0.

- **limit** - _Number_ [Omitempty](#omitempty) The number of entries, default
  100, max 100.

**Return Value**

_Array_ - List of application parameters

- **app_id** - _Number_ - Application ID
- **list** - _Number_ - Each element of the array contains the following
  parameters
  - **id** - _String_ - parameter ID, unique;
  - **name** - _String_ - the name of the parameter;
  - **value** - _String_ - the parameter value;
  - **conditions** - _String_ - permissions to change parameters.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.appParams","id":1,"params":[1,1,"role_developer,role_governancer"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "app_id": 1,
            "list": [
                {
                    "id": "4",
                    "name": "role_developer",
                    "value": "1",
                    "conditions": "ContractConditions(\"MainCondition\")"
                },
                {
                    "id": "5",
                    "name": "role_governancer",
                    "value": "2",
                    "conditions": "ContractConditions(\"MainCondition\")"
                }
            ]
        }
    }
```

### **ibax.getEcosystemParams** {#ibax-getecosystemparams}

Get a list of ecosystem parameters

[Authorization](#authorization)

**Parameters**

- **ecosystem** - _Number_ - [Omitempty](#omitempty) - Ecosystem ID

  If 0 or no such parameter, default: current ecid.

- **names** - _String_ - [Omitempty](#omitempty) - The name of the filter
  parameter.

  Comma-separated list of names, e.g.: `name1,name2`

  The _offset_ and _limit_ parameters are invalid when there is a filter
  parameter.

- **offset** - _Number_ - [Omitempty](#omitempty) The offset, default is 0.

- **limit** - _Number_ [Omitempty](#omitempty) The number of entries, default
  100, max 100.

**Return Value**

- **list** - _Array_ - Each element of the array contains the following
  parameters:
  - **id** - _String_ - The id of the parameter, unique.
  - **name** - _String_ - The name of the parameter.
  - **value** - _String_ - The value of the parameter.
  - **conditions** - _String_ - permissions to change parameters.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getEcosystemParams","id":1,"params":[0,"changing_app_params,changing_language"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "list": [
                {
                    "id": "9",
                    "name": "changing_app_params",
                    "value": "ContractConditions(\"DeveloperCondition\")",
                    "conditions": "ContractConditions(\"DeveloperCondition\")"
                },
                {
                    "id": "4",
                    "name": "changing_language",
                    "value": "ContractConditions(\"DeveloperCondition\")",
                    "conditions": "ContractConditions(\"DeveloperCondition\")"
                }
            ]
        }
    }
```

### **ibax.getTableCount** {#ibax-gettablecount}

Returns a list of data tables for the current ecosystem.

Offset and number of entries can be set

[Authorization](#authorization)

**Parameters**

- **offset** - _Number_ - [Omitempty](#omitempty) The offset, default is 0.

- **limit** - _Number_ [Omitempty](#omitempty) The number of entries, default
  100, max 100.

**Return Value**

- **count** - _Number_ - The total number of sheets of the current ecosystem
  data table.

- **list** - _Array_ - Each element of the array contains the following
  parameters:
  - **name** - _String_ - The name of the data table without prefix.
  - **count** - _String_ - The number of entries in the data table.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getTableCount","id":1,"params":[0,2]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "count": 32,
            "list": [
                {
                    "name": "app_params",
                    "count": "41"
                },
                {
                    "name": "applications",
                    "count": "7"
                }
            ]
        }
    }
```

### **ibax.getTable** {#ibax-gettable}

Returns information about the current ecosystem request data table.

[Authorization](#authorization)

**Parameters**

- **tableName** - _String_ - Data table name

**Return Value**

- **name** - _String_ - The name of the data table.

- **insert** - _String_ - Add permission to add an entry.

- **new_column** - _String_ - Add new field permission.

- **update** - _String_ - Change entry permissions.

- **app_id** - _String_ - The application id.

- **conditions** - _String_ - Conditions for changing permissions.

- **columns** - _Array_ - Array of information related to data table fields:
  - **name** - _String_ - The name of the field.
  - **type** - _String_ - The field data type.
  - **perm** - _String_ - Permission to change the value of this field.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getTable","id":1,"params":["app_params"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "name": "app_params",
            "insert": "ContractConditions(\"DeveloperCondition\")",
            "new_column": "ContractConditions(\"@1MainCondition\")",
            "update": "ContractAccess(\"@1EditAppParam\")",
            "conditions": "ContractConditions(\"@1MainCondition\")",
            "app_id": "1",
            "columns": [
                {
                    "name": "value",
                    "type": "text",
                    "perm": "ContractAccess(\"@1EditAppParam\")"
                },
                {
                    "name": "app_id",
                    "type": "number",
                    "perm": "ContractAccess(\"@1ItemChangeAppId\")"
                },
                {
                    "name": "ecosystem",
                    "type": "number",
                    "perm": "false"
                },
                {
                    "name": "conditions",
                    "type": "text",
                    "perm": "ContractAccess(\"@1EditAppParam\")"
                },
                {
                    "name": "permissions",
                    "type": "json",
                    "perm": "ContractConditions(\"@1MainCondition\")"
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "perm": "false"
                }
            ]
        }
    }
```

### **ibax.getList** {#ibax-getlist}

Returns the entry of the specified data table.

You can specify the columns to be returned.

You can set the offset and the number of entries.

You can set the query criteria.

Hex encoding of data tables of type _BYTEA_ (byte arrays, hashes, byte code
arrays)

[Authorization](#authorization)

**Parameters** _Object_ - Get the data table object

- **name** - _String_ - The name of the data table.

- **limit** - _Number_ - [Omitempty](#omitempty) The number of entries,
  default 25.

- **offset** - _Number_ - [Omitempty](#omitempty) The offset, default is 0.

- **order** - _String_ - [Omitempty](#omitempty) Sort by, default id ASC.

- **columns** - _String_ - [Omitempty](#omitempty) A comma-separated list of
  requested columns, if not specified, all columns will be returned.

  The id column will be returned in all cases.

- **where** - _Object_ - [Omitempty](#omitempty)

  Query criteria

  Example:If you want to query id>2 and name = john

  You can use `where:{"id":{"$gt":2}, "name":{"$eq": "john"}}`

  For details, please refer to [DBFind](../topics/script.md#dbfind) where syntax

**Return Value**

- **count** - _Number_ - the total number of entries.
- **list** - _Array_ - Each element of the array contains the following
  parameters:

  - **id** - _String_ - The ID of the entry.
  - **...** - Other columns of the data table.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getList","id":1,"params":[{"name":"@1history","where":{"$and": [{"id":{"$gt": 2}}, {"id":{"$lt": 5}}]}}]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "count": 2,
            "list": [
                {
                    "amount": "1000000000000000000",
                    "block_id": "4",
                    "comment": "UTXO",
                    "created_at": "1676538080433",
                    "ecosystem": "1",
                    "id": "3",
                    "recipient_balance": "1000000000000000000",
                    "recipient_id": "666...160",
                    "sender_balance": "1000000000000000000",
                    "sender_id": "666...3160",
                    "status": "0",
                    "txhash": "2ac156c0ce55c10fd485cb9d59f50e3f9b269fb9bb69571d3c2eeae033d6c6cc",
                    "type": "24",
                    "value_detail": "NULL"
                }
            ]
        }
    }
```

### **ibax.getSections** {#ibax-getsections}

Return to the tab of the current ecosystem list of table entries, you can set
the offset and the number of entries.

If _role_access_ field contains a list of roles and does not include the current
role, no record will be returned. The data in the _title_ field will be replaced
by the _Accept-Language_ language resource in the request header.

[Authorization](#authorization)

**Parameters**

- _Object_ - Get the actions request object

  - **limit** - _Number_ - [Omitempty](#omitempty) - The number of entries,
    default 25 entries.

  - **offset** - _Number_ - [Omitempty](#omitempty) - The offset, default is 0.

  - **lang** - _String_ - [Omitempty](#omitempty) -

    This field specifies the multilingual resource code or localization, e.g.
    _en, de_. If the specified multilingual resource is not found, e.g. _en-US_,
    then search in the Multilingual Resources group, **default**: **en**.

**Return Value**

- **count** - _Number_ - the total number of tab entries.

- **list** - _Array_ - Each element of the array contains information about all
  columns in the sections table.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getSections","id":1,"params":[{"offset":0,"limit":2}]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "count": 2,
            "list": [
                {
                    "ecosystem": "1",
                    "id": "1",
                    "page": "default_page",
                    "roles_access": "[]",
                    "status": "2",
                    "title": "Home",
                    "urlname": "home"
                },
                {
                    "ecosystem": "1",
                    "id": "2",
                    "page": "developer_index",
                    "roles_access": "[]",
                    "status": "1",
                    "title": "Developer",
                    "urlname": "developer"
                }
            ]
        }
    }
```

### **ibax.getRow** {#ibax-getrow}

Returns the entries of the specified data table in the current ecosystem. You
can specify the columns to be returned.

[Authorization](#authorization)

**Parameters**

- **tableName** - _String_ - The name of the data table.

- **id** - _Number_ - the ID of the entry.

- **columns** - _String_ - [Omitempty](#omitempty)

  A comma-separated list of requested columns, if not specified, all columns
  will be returned.

  If you do not filter, you can place a blank "".

  The id column will be returned in all cases.

- **whereColumn** - _String_ - [Omitempty](#omitempty) - Find column name (only
  Number type columns can be found)

**Return Value**

- **value**- _Object_ - object that receives column values
  - **id** - _String_ - The ID of the entry.
  - **...** - The sequence of requested columns.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getRow","id":1,"params":["@1history",4,"id,sender_id,recipient_id,amount,ecosystem,created_at","id"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "value": {
                "amount": "680388766240",
                "created_at": "1677222830899",
                "ecosystem": "1",
                "id": "296",
                "recipient_id": "6667782293976713160",
                "sender_id": "6660819716178795186"
            }
        }
    }
```

### **ibax.systemParams** {#ibax-systemparams}

Returns the list of platform parameters.

[Authorization](#authorization)

**Parameters**

- **names** - _String_ [Omitempty](#omitempty) - A list of request parameters,
  separated by commas.

  For example `names="name1,name2"`.

- **offset** - _Number_ - [Omitempty](#omitempty) The offset, default is 0.

- **limit** - _Number_ [Omitempty](#omitempty) The number of entries, default
  100, max 100.

**Return Value**

- **list** - _Array_ - Each element of the array contains the following
  parameters:
  - **id** - _String_ - Unique id
  - **name** - _String_ - The name of the parameter.
  - **value** - _String_ - The value of the parameter.
  - **conditions** - _String_ - permissions to change parameters.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.systemParams","id":1,"params":["gap_between_blocks,honor_nodes"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "list": [
                {
                    "id": "4",
                    "name": "gap_between_blocks",
                    "value": "2",
                    "conditions": "ContractAccess(\"@1UpdatePlatformParam\")"
                },
                {
                    "id": "6",
                    "name": "honor_nodes",
                    "value": "",
                    "conditions": "ContractAccess(\"@1UpdatePlatformParam\")"
                }
            ]
        }
    }
```

### **ibax.history** {#ibax-history}

Returns the changed records of the entries of the specified data table in the
current ecosystem

[Authorization](#authorization)

**Parameters**

- **name** - _String_ - The name of the data table.
- **tableId** - _Number_ - the ID of the entry.

**Return Value**

- **list** - _Array_ - Each element of the array contains change records for the
  requested entry.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.history","id":1,"params":["contracts",1]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "list": [
                {
                    "conditions": "ContractConditions(\"MainCondition\")",
                    "ecosystem": "1",
                    "value": "// This contract is used to set \"developer\" rights....."
                }
            ]
        }
    }
```

### **ibax.getPageRow** {#ibax-getpagerow}

Gets the current entry in the ecosystempages data table field.

[Authorization](#authorization)

**Parameters**

- **name** - _String_ - Specifies the name of the entry in the table.

**Return Value**

- **id** - _Number_ - the ID of the entry.
- **name** - _String_ - The name of the entry.
- **value** - _String_ - The content.
- **menu** - _String_ - Directory.
- **nodesCount** - _Number_ - the number of nodes the page needs to validate
- **app_id** - _Number_ - Application Id
- **conditions** - _String_ - permissions to change parameters

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getPageRow","id":1,"params":["default_page"]}' http://127.0.0.1:7079


    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "id": 5,
            "name": "default_page",
            "value": "If(#account_id# == #guest_account#){\n    Include(@1apps_description)\n}.Else{\n    Include(@1profile)\n}",
            "menu": "default_menu",
            "nodesCount": 1,
            "app_id": 1,
            "conditions": "ContractConditions(\"@1DeveloperCondition\")"
        }
    }
```

### **ibax.getMenuRow** {#ibax-getmenurow}

Gets the current entry in the ecosystem menu data table field.

[Authorization](#authorization)

**Parameters**

- **name** - _String_ - Specifies the name of the entry in the table.

**Return Value**

- **id** - _Number_ - the ID of the entry.
- **name** - _String_ - The name of the entry.
- **title** - _String_ - The title.
- **value** - _String_ - The content.
- **conditions** - _String_ - permissions to change parameters

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getMenuRow","id":1,"params":["default_menu"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "id": 2,
            "name": "default_menu",
            "title": "default",
            "value": "\nMenuItem.....",
            "conditions": "ContractConditions(\"@1DeveloperCondition\")"
        }
    }
```

### **ibax.getSnippetRow** {#ibax-getsnippetrow}

Gets the current entry in the ecosystem snippet data table field.

[Authorization](#authorization)

**Parameters**

- **name** - _String_ - Specifies the name of the entry in the table.

**Return Value**

- **id** - _Number_ - the ID of the entry.
- **name** - _String_ - The name of the entry.
- **value** - _String_ - The content.
- **conditions** - _String_ - permissions to change parameters.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getSnippetRow","id":1,"params":["welcome"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "id": 12,
            "name": "welcome",
            "value": "Div(content-wrapper)....",
            "conditions": "ContractConditions(\"@1DeveloperCondition\")"
        }
    }
```

### **ibax.getAppContent** {#ibax-getappcontent}

Get application related information (including page, snippet, menu)

[Authorization](#authorization)

**Parameters**

- **id** - _Number_ - Application id

**Return Value**

- **snippets** - _Array_ - Array of code snippet information

  - **id** - _Number_ - id
  - **name** - _String_ - Code snippet name

- **pages** - _Array_ - Array of page information

  - **id** - _Number_ - id
  - **name** - _String_ - page name

- **contracts** - _Array_ - an array of contract information

  - **id** - _Number_ - id
  - **name** - _String_ - Contract name

**Example**

```text
    //Request
    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "snippets": [ //if not app snippets is null array,example:[]
                {
                    "id": 2,
                    "name": "developer_link"
                },
                {
                    "id": 3,
                    "name": "export_info"
                }
            ],
            "pages": [  //if not app pages is null array,example:[]
                {
                    "id": 6,
                    "name": "menus_list"
                },
                {
                    "id": 7,
                    "name": "params_edit"
                }
            ],
            "contracts": [  //if not app contracts is null array,example:[]
                {
                    "id": 2,
                    "name": "MainCondition"
                },
                {
                    "id": 33,
                    "name": "NodeOwnerCondition"
                }
            ]
        }
    }
```

### **ibax.getMember** {#ibax-getmember}

Get member information

**Parameters**

- **account** - _String_ - Member Information

- **ecosystemId** - _Number_ - ecoid

**Return Value**

- **id** - _Number_ - member id
- **member_name** - _String_ - Name
- **image_id** - _Number_ - Avatar id
- **member_info** - _String_ - Introduction

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}}" -d '{"jsonrpc":"2.0","method":"ibax.getMember","id":1,"params":["1497-2036-4953-3607-1121",1]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "id": 14,
            "member_name": "som",
            "image_id": 5,
            "member_info": "{\"information\": \"Everything will be okay in the end. If it's not okay, it's not the end.\"}"
        }
    }
```

### **ibax.getContracts** {#ibax-getcontracts}

Get the list of contracts in the current ecosystem, you can set the offset and
the number of entries.

[Authorization](#authorization)

**Parameters**

- **offset** - _Number_ - [Omitempty](#omitempty) The offset, default is 0.
- **limit** - _Number_ - [Omitempty](#omitempty) The number of entries,
  default 25.

**Return Value**

- **count** - _Number_ - the total number of entries.

- **list** - _Array_ - Each element of the array contains the following
  parameters:
  - **id** - _String_ - Contract ID.
  - **name** - _String_ - The name of the contract.
  - **value** - _String_ - The content of the contract.
  - **wallet_id** - _String_ - The address of the account to which the contract
    is bound.
  - **address** - _String_ - the address of the contract-bound wallet
    `XXXX-... -XXXX`.
  - **ecosystem_id** - _String_ - The ecosystem ID to which the contract
    belongs.
  - **app_id** - _String_ - The ID of the application to which the contract
    belongs.
  - **conditions** - _String_ - Change the permissions of the contract.
  - **token_id** - _String_ - The ID of the ecosystem where the pass is used as
    a payment for the contract.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getContracts","id":1,"params":[0,1]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "count": 293,
            "list": [
                {
                    "address": "0000-0000-0000-0000-0000",
                    "app_id": "1",
                    "conditions": "ContractConditions(\"@1DeveloperCondition\")",
                    "ecosystem_id": "1",
                    "id": "1",
                    "name": "DeveloperCondition",
                    "token_id": "1",
                    "value": "// This contract is used to ...",
                    "wallet_id": "0"
                }
            ]
        }
    }
```

### **ibax.getContractInfo** {#ibax-getcontractinfo}

Returns information about the specified contract.

[Authorization](#authorization)

**Parameters**

- **contractName** - _String_ - The name of the contract. The format is
  `@ecosystem_id%%contractName%`, e.g. @1contractName (the specified
  eco1contract name contractName) or contractName (the current eco-contract name
  contractName).

**Return Value**

- **id** - _Number_ - the contract ID in the VM.
- **name** - _String_ - Contract name with ecosystem ID `@1MainCondition`.
- **state** - _Number_ - the ecosystem ID to which the contract belongs.
- **walletid** - _String_ - the address of the account to which the contract is
  bound
- **tokenid** - _String_ - the ecosystem ID of the pass that is used as the
  payment for the contract.
- **address** - _String_ - the address of the contract-bound wallet
  `XXXX-... -XXXX`.
- **tableid** - _String_ - ID of the entry in the _contracts_ table where the
  contract is located.
- **fields** - _Array_ - array containing structural information for each
  parameter of the contract **data** section:
  - **name** - _String_ - The name of the parameter.
  - **type** - _String_ - The type of the parameter.
  - **optional** - _Bool_ - parameter options, `true` means optional parameters,
    `false` means mandatory parameters.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getContractInfo","id":1,"params":["@1TokensSend"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "id": 5098,
            "state": 1,
            "tableid": "98",
            "walletid": "0",
            "tokenid": "1",
            "address": "0000-0000-0000-0000-0000",
            "fields": [
                {
                    "name": "Amount",
                    "type": "money",
                    "optional": false
                },
                {
                    "name": "Recipient",
                    "type": "string",
                    "optional": true
                },
                {
                    "name": "iName",
                    "type": "string",
                    "optional": true
                },
                {
                    "name": "Comment",
                    "type": "string",
                    "optional": true
                },
                {
                    "name": "Ecosystem",
                    "type": "int",
                    "optional": true
                }
            ],
            "name": "@1TokensSend"
        }
    }
```

### **ibax.sendTx** {#ibax-sendtx}

Receives the transactions in the parameters and adds them to the transaction
queue, returning a transaction hash if the request is executed successfully.
This hash yields the corresponding transaction within the block and is included
in the error text message in case of an error response.

[Authorization](#authorization)

**Parameters**

- _Object_ - Transaction data object
  - **tx_key** - _String_ - the content of the transaction, this parameter can
    specify any name and supports receiving multiple transactions.

**Return Value**

- **hashes** - _Array_ - transaction hash arrays:
  - **tx1** - _String_ - Hash of transaction 1.
  - **txN** - _String_ - Hash of transaction N.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.sendTx","id":1,"params":[{"tx1":...,"txN":...}]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "hashes":[
                {"hash1":"hash1"},
                {"hashN":"hashN"}
            ]
        }
    }
```

### **ibax.txStatus** {#ibax-txstatus}

Gets the block ID and error message of the specified transaction hash. If the
return value of the block ID and error text message is null, then the
transaction is not yet contained in the block.

[Authorization](#authorization)

**Parameters**

- **hashes** - _String_ - transaction hash, split using `,`.

**Return Value**

- **hash** - _Object_ - The transaction hash.

  - **blockid** - _String_ - returns the block ID if the transaction was
    executed successfully;

    If the transaction execution fails, _blockid_ will be `0`, and the
    corresponding block ID will be returned if the transaction execution error
    is penalized.

  - **result** - _String_ - Returns the result of the transaction via the
    **\$result** variable.
  - **errmsg** - _Object_ - [Omitempty](#omitempty) Returns an error text
    message if the execution of the transaction failed.
    - **type** - _String_ - Error type
    - **error** - _String_ - error message
  - **penalty** - _Number_ - if the transaction execution fails, (0: no penalty
    1: penalty)

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.txStatus","id":1,"params":["cf46ef1ce7ecfcf48ccf209577fb8a2130426b71adc3a3855aff7f68d114fca9,4a458232de2ab2a3f5361da68e409b925c775346d14139263a69c0e8ecf0166b"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 2,
        "result": {
            "4a458232de2ab2a3f5361da68e409b925c775346d14139263a69c0e8ecf0166b": {
                "blockid": "793",
                "result": "",
                "penalty": 0
            },
            "cf46ef1ce7ecfcf48ccf209577fb8a2130426b71adc3a3855aff7f68d114fca9": {
                "blockid": "793",
                "errmsg": {
                    "type": "warning",
                    "error": "platform ecosystem can not be burning Tokens"
                },
                "result": "",
                "penalty": 1
            }
        }
    }
```

### **ibax.txInfo** {#ibax-txinfo}

Returns information about the transaction for the specified hash, including the
block ID and the number of confirmations. If optional parameters are specified,
the contract name and its associated parameters can also be returned.

**Parameters**

- **hash** - _String_ - The transaction hash.

- **contractinfo** - _Bool_ [Omitempty](#omitempty) - Contract detail parameter
  identifier, get contract details related to this transaction, default is
  `false`

**Return Value**

- **blockid** - _Number_ - The block ID containing the transaction. If the value
  is `0`, no transactions are found for this hash. If the transaction occurred
  on the current node, it can be obtained via [ibax.txStatus](#ibax-txstatus)

- **confirm** - _Number_ - the number of node confirmations for this block
  _blockid_.

- **data** - _Object_ - Returns contract details if `contentinfo=true` is
  specified. null if not specified
  - **block_id** - _Number_ - block height
  - **block_hash** - _String_ - block_hash
  - **address** - _String_ - transaction creation address
  - **ecosystem** - _String_ - transaction sending ecid
  - **hash** - _String_ - transaction hash
  - **expedite** - _String_ - expedited fee, or "" if not available
  - **contract_name** - _String_ - Contract name
  - **params** - _Object_ - contract parameters, contract fields can be queried
    via [ibax.getContractInfo](#ibax-getcontractinfo)
  - **created_at** - _Number_ - when the transaction was created
  - **size** - _String_ - transaction size unit: B;KiB;MiB;GiB;TiB
  - **status** - _String_ - status (0:success 1:penalty)

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.txInfo","id":1,"params":["020d8c004b3a0c00a6bfffa36e2746509295e5ea6dbb14e7cd6098c3d906bb58",true]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "blockid": "796",
            "confirm": 0,
            "data": {
                "block_id": 796,
                "block_hash": "bccbc3cf47b49bee5fb7321810884db49b73f5114b0a6fcd234dd3fdf9c22ef4",
                "address": "0666-7782-2939-7671-3160",
                "ecosystem": 2,
                "hash": "020d8c004b3a0c00a6bfffa36e2746509295e5ea6dbb14e7cd6098c3d906bb58",
                "expedite": "1",
                "contract_name": "@1TokensSend",
                "params": {
                    "Amount": "1000000000000",
                    "Recipient": "0666-7782-2939-7671-3160"
                },
                "created_at": 1678774455841,
                "size": "213.00B",
                "status": 1
            }
        }
    }
```

### **ibax.txInfoMultiple** {#ibax-txinfomultiple}

Returns transaction-related information for the specified hash list.

**Parameters**

- **hashes** - _Array_ - A list of transaction hashes.

- **contractinfo** - _Bool_ [Omitempty](#omitempty) - Contract detail parameter
  identifier, get contract details related to this transaction, default is
  `false`

**Return Value**

- **results** - _Array_ - Data dictionary with transaction hash as key and
  transaction details as value.
  - **hash** - _String_ - The transaction hash.
    - **blockid** - _Number_ - The block ID containing the transaction. if the
      value is `0`, then no transaction was found for that hash.
    - **confirm** - _Number_ - the number of confirmations for this block
      _blockid_.
    - **data** - _Object_ - If `contentinfo=true`is specified, the contract
      details are returned to this parameter. null when not specified
      - **block_id**- _Number_ - Block height
      - **block_hash** - _String_ - block_hash
      - **address** - _String_ - transaction creation address
      - **ecosystem** - _String_ - transaction sending ecid
      - **hash** - _String_ - transaction hash
      - **expedite** - _String_ - expedited fee, or "" if not available
      - **contract_name** - _String_ - Contract name
      - **params** - _Object_ - contract parameters, contract fields can be
        queried via [ibax.getContractInfo](#ibax-getcontractinfo)
      - **created_at** - _Number_ - when the transaction was created
      - **size** - _String_ - transaction size unit: B;KiB;MiB;GiB;TiB
      - **status** - _String_ - status (0:success 1:penalty)

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getPageValidatorsCount","id":1,"params":[["1875b4fc02a8bf5ccf0d3fbce83011dd6711d8d325c7d731ac659b8beffc0284","4a458232de2ab2a3f5361da68e409b925c775346d14139263a69c0e8ecf0166b"],true]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "results": {
                "1875b4fc02a8bf5ccf0d3fbce83011dd6711d8d325c7d731ac659b8beffc0284": {
                    "blockid": 0,
                    "confirm": 0,
                    "data": null
                },
                "4a458232de2ab2a3f5361da68e409b925c775346d14139263a69c0e8ecf0166b": {
                    "blockid": 793,
                    "confirm": 0,
                    "data": {
                        "block_id": 793,
                        "block_hash": "ef3b2f2e18662e0b8bba136a209e30c5aae76d9a82e0b21209786f62fe5676e4",
                        "address": "0666-0819-7161-7879-5186",
                        "ecosystem": 1,
                        "hash": "4a458232de2ab2a3f5361da68e409b925c775346d14139263a69c0e8ecf0166b",
                        "expedite": "1",
                        "contract_name": "@1TokensSend",
                        "params": {
                            "Amount": "200",
                            "Comment": "Hello Dear",
                            "Recipient": "1196-2490-5275-7101-3496"
                        },
                        "created_at": 1678765099072,
                        "size": "297.00B",
                        "status": 0
                    }
                }
            }
        }
    }
```

### **ibax.getPageValidatorsCount** {#ibax-getpagevalidatorscount}

Returns the number of nodes to be validated for the specified page.

**Parameters**

- **name** - _String_ - page name in the format `@ecosystem_id%%%page_name%`,
  e.g. @1params_list (specifying ecosystem 1 page name params_list) or
  params_list (current ecosystem page name params_list)

**Return Value**

- **validate_count** - _Number_ - Specifies the number of nodes to be validated
  by the page.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getPageValidatorsCount","id":1,"params":["@1params_list"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "validate_count": 1
        }
    }
```

### **ibax.getPage** {#ibax-getpage}

Gets the tree of code JSON objects for the specified page name, which is the
result of processing by the templating engine.

[Authorization](#authorization)

**Parameters**

- **name** - _String_ - the name of the page with the ecosystem ID in the format
  `@ecosystem_id%%page_name%`, for example `@1main_page`.

  If you don't have an ecosystem ID, the default is to find the current
  ecosystem page, e.g. `main_page`

**Return Value**

- **menu** - _String_ - The name of the menu to which the page belongs.

- **menutree** - _Array_ - JSON object tree of the page's menus.

- **tree** - _Array_ - page JSON object tree.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getPage","id":1,"params":["@1params_list"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "menu": "developer_menu",
            "menutree": [
                {
                    "tag": "menuitem",
                    "attr": {
                        "icon": "icon-cloud-upload",
                        "page": "@1import_upload",
                        "title": "Import"
                    }
                }
                ...
            ],
            "tree": [
                {
                    ....
                }
                ...
            ],
            "nodesCount": 1
        }
    }
```

### **ibax.getMenu** {#ibax-getmenu}

Gets the tree of code JSON objects for the specified menu name, which is the
result of processing by the template engine.

[Authorization](#authorization)

**Parameters**

- **name** - _String_ -
  > Menu name with ecosystem ID in the format `@ecosystem_id%%%menu_name%`, e.g.
  > `@1main_menu`. If you don't bring the ecosystem ID, the menu of the current
  > ecosystem will be found by default, for example `main_menu`

**Return Value**

- **title** - _String_ - the menu title.

- **tree** - _Array_ - Menu JSON object tree.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getMenu","id":1,"params":["@1default_menu"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "title": "default",
            "tree": [
                {
                    "tag": "menuitem",
                    "attr": {
                        "icon": "icon-cloud-upload",
                        "page": "@1import_upload",
                        "title": "Import"
                    }
                }
                ...
            ]
        }
    }
```

### **ibax.getSource** {#ibax-getsource}

Returns a tree of coded JSON objects for the specified page name. Does not
execute any functions or receive any data. The returned JSON object tree
corresponds to the page template and can be used in the visual page designer. If
the page is not found, a 404 error is returned.

[Authorization](#authorization)

**Parameters**

- **name** - _String_ - Page name with ecosystem ID in the format
  `@ecosystem_id%%%page_name%`, for example `@1main_page`. If you don't have an
  ecosystem ID, the default is to find the current ecosystem page e.g.
  `main_page`

**Return Value**

- **tree** - _Array_ - JSON object tree for the page.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer {$Token}" -d '{"jsonrpc":"2.0","method":"ibax.getSource","id":1,"params":["@1params_list"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "tree": [
                {
                    "tag": "dbfind",
                    "attr": {
                        "name": "@1applications"
                    },
                    "tail": [
                        {
                            "tag": "where",
                            "attr": {
                                "where": "{\"ecosystem\": \"#ecosystem_id#\", \"name\": \"System\"}"
                            }
                        }
                        ...
                    ]
                },
                {
                    "tag": "setvar",
                    "attr": {
                        "name": "role_developer_id",
                        "value": "AppParam(Ecosystem: #ecosystem_id#, App: #application_id#, Name: role_developer)"
                    }
                },
                {
                    "tag": "dbfind",
                    "attr": {
                        "name": "@1roles_participants"
                    },
                    "tail": [
                        {
                            "tag": "where",
                            "attr": {
                                "where": "{\"ecosystem\": \"#ecosystem_id#\", \"$and\": [{\"role->id\": {\"$in\": [#role_developer_id#]}}, {\"role->id\": \"#role_id#\"}], \"member->account\": \"#account_id#\", \"deleted\": 0}"
                            }
                        }
                        ...
                    ]
                },
                {
                    "tag": "if",
                    "attr": {
                        "condition": "#developer_access_id#>0"
                    },
                    "children": [
                        {
                            "tag": "setvar",
                            "attr": {
                                "name": "this_page",
                                "value": "@1params_list"
                            }
                        }
                        ...
                    ],
                    "tail": [
                        {
                            "tag": "else",
                            "children": [
                                {
                                    "tag": "settitle",
                                    "attr": {
                                        "title": "$@1ecosystem_parameters$"
                                    }
                                }
                                ...
                            ]
                        }
                    ]
                }
            ]
        }
    }
```

### **ibax.getPageHash** {#ibax-getpagehash}

Returns a SHA256 hash of the specified page name, or a 404 error if the page is
not found.

To receive the correct hash when making requests to other nodes, you must also
pass the _ecosystem,key_id,role_id_ parameter. To receive pages from other
ecosystems, the ecosystem ID must be prefixed to the page name. For example:
`@2mypage`.

**Parameters**

- **name** - _String_ - The name of the page with the ecosystem ID. The format
  is `@ecosystem_id%%%page_name%`, e.g. `@1main_page`, you can specify the eco
  ID

- **ecosystem** - _Number_ - [Omitempty](#omitempty) Ecosystem ID.

- _Object_ - [Omitempty](#omitempty) Get the specified page object
  - **key_id** - _String_ - The account address.
  - **role_id** - _String_ - The role ID.

**Return Value**

- _Object_ -
  - **hash** - _String_ - Hexadecimal hash.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getPageHash","id":1,"params":["@1params_list",0,{"role_id":"1","key_id":"-6484253546138538120"}]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "hash": "fc5ed3b5e879dd5521dfb792e815019bd8411851e850e75a3590d71e950a0465"
        }
    }
```

### **ibax.getContent** {#ibax-getcontent}

Returns the number of JSON objects for the page code from the **template**
parameter, if the optional parameter **source** Specified as `true`, this JSON
object tree does not perform any functions and receive data. This JSON object
tree can be used in the visual page designer.

**Parameters**

- _Object_

  - **template** - _String_ - page code.

  - **source** - _Bool_ - If specified as `true`, the JSON object tree does not
    perform any functions and receives data.

**Return Value**

- **tree** - _Object_ - JSON object tree.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getContent","id":1,"params":[{"template","..."source":true}]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "tree": {
                "type":"......",
                "children": [
                    {...},
                    {...}
                ]
            }
        }
    }

```

### **ibax.getBlockInfo** {#ibax-getblockinfo}

Returns information about the specified block ID.

**Parameters**

- **id** - _Number_ - the height of the block.

**Return Value**

- **hash** - _String_ - The block hash value.

- **key_id** - _Number_ - the address of the account that signed the block.

- **time** - _Number_ block generation timestamp.

- **tx_count** - _Number_ - the total number of transactions within the block.

- **rollbacks_hash** - _String_ - The block rollback hash.

- **node_position** - _Number_ - The position of the block in the honor node
  list.

- **consensus_mode** _Number_ - Consensus mode, parameters (1: creator
  management mode 2: DAO governance mode)

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getBlockInfo","id":1,"params":[12]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "hash": "Hl+/VvYFFu4iq4zLrRDGHBhm7DM7llEAfEJyaX2Q3is=",
            "key_id": 6667782293976713160,
            "time": 1677134955,
            "tx_count": 1,
            "rollbacks_hash": "o37QAighKMb8WqbEHAqCQb5bOfMvOqV0WoTaN631q74=",
            "node_position": 0,
            "consensus_mode": 1
        }
    }
```

### **ibax.getConfig** {#ibax-getconfig}

Get the host address and port of centrifugo

**Parameters**

- **option** - _String_ - Configuration item

  1. "centrifugo" - messaging service

**Return Value**

- **centrifugo** - _String_ - [Omitempty](#omitempty) host address and port of
  centrifugo Result format `http://address:port`, e.g.: `http://127.0.0.1:8100`.

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"ibax.getConfig","id":1,"params":["centrifugo"]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "centrifugo":"http://127.0.0.1:8100"
        }
    }
```

### **net.getNetwork** {#net-getnetwork}

Get node information

**Parameters**

- None

**Return Value**

- **network_id** - _String_ - The network identifier.
- **centrifugo_url** - _String_ - centrifugo message service address
- **test** - _Bool_ - whether it is a test chain
- **private** - _Bool_ - whether the chain is private
- **honor_nodes** - _Object_ - List of honor nodes
  - **tcp_address** - _String_ - tcp address
  - **api_address** - _String_ - api address
  - **public_key** - _String_ - node public key
  - **unban_time** - _String_ - Unlock time

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"net.getNetwork","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "network_id": "1",
            "centrifugo_url": "127.0.0.1",
            "test": false,
            "private": false,
            "honor_nodes": [
                {
                    "tcp_address": "127.0.0.1:7078",
                    "api_address": "http://127.0.0.1:7078",
                    "public_key": "049a41b24862f8db61ee66fb206094baa57bfeac7ea786d63662a964d144eb85d1a0e230928d56f46dd61eefac7640b6aa2883b2445c7b2adc0e581f983ff0aedb",
                    "unban_time": "-62135596800"
                }
            ]
        }
    }
```

### **net.status** {#net-status}

Get the current node status

**Parameters**

- None

**Return Value**

- **status** - _String_ - Node Status "node server status is running" - the node
  is running "node server is updating" - node is being updated "node server is
  stopped" - node suspended

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"net.status","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": "node server status is running"
    }
```

### **rpc.modules** {#rpc-modules}

Get the currently registered JSON-RPC interface

**Parameters**

- None

**Return Value**

- _Array_ - JSON-RPC interface array

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"rpc.modules","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": [
            "net.getNetwork",
            "ibax.getAppContent",
            "ibax.honorNodesCount",
            "ibax.maxBlockId",
            "ibax.detailedBlock",
            "ibax.getConfig",
            "ibax.getTableCount",
            "ibax.getMenu"
        ]
    }
```

### **admin.startJsonRpc** {#admin-startjsonrpc}

Can be used to switch between JSON-RPC change namespace services

**Parameters**

- **methods** - _String_ - JSON-RPC module, default: "ibax,net"

**Return Value**

- _bool_ - execution status

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"admin.startJsonRpc","id":1,"params":["ibax,net,admin"]}' http://127.0.0.1:8385

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": true
    }
```

### **admin.stopJsonRpc** {#admin-stopjsonrpc}

Close the JSON-RPC service

**Parameters**

- None

**Return Value**

- _bool_ - execution status

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"admin.stopJsonRpc","id":1,"params":[]}' http://127.0.0.1:8385

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": true
    }
```

### **debug.getNodeBanStat** {#debug-getnodebanstat}

Get node disable status

**Parameters**

- None

**Return Value** **node_position** - _Number_ - node subscript **status** -
_Bool_ - Disable status, `true` ban status, `false` not disabled

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"debug.getNodeBanStat","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": [
            {
                "node_position": 0,
                "status": true
            }
        ]
    }
```

### **debug.getMemStat** {#debug-getmemstat}

Get the current node memory usage

**Parameters**

- None

**Return Value**

- **alloc** - _Number_ - Number of bytes requested and still in use
- **sys** - _Number_ - Number of bytes fetched from the system

**Example**

```text
    //Request
    curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"debug.getMemStat","id":1,"params":[]}' http://127.0.0.1:7079

    //Response
    {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "alloc": 11537432,
            "sys": 35329248
        }
    }
```
