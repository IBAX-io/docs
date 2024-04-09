---
sidebar_position: 2
title: Spesifikasyonu

toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Needle Spesifikasyonu {#needle-specification}

Needle Spesifikasyonu, Needle dilinin resmi bir açıklamasıdır. Bu, dilin
ayrıntılarını anlamak isteyen geliştiriciler için bir referanstır.

Bu, golang ile deneyimi olan geliştiricilere tanıdık gelen bir sözdizimi ile
statik olarak tipi belirlenmiş bir dildir.

## Dosya Yapısı {#file-structure}

Needle dilinde, ana kod blok yapısı [Akıllı Sözleşme](#spec-contract),
[Veri](#spec-data), [Fonksiyon](#spec-function), [Ayarlar](#spec-settings)
içerir.

### Akıllı Sözleşme {#spec-contract}

`contract` anahtar kelimesini kullanarak bir akıllı sözleşme bildirin, ardından
akıllı sözleşmenin adı gelir ve içeriği süslü parantezler içinde olmalıdır.

> `ContractStmt` = "contract" [Identifier](#spec-identifier) >
> [CodeBlockStmt](#spec-codeblock).

Akıllı sözleşme yapısının üç ana parçası vardır: [Veri](#spec-data),
[Ayarlar](#spec-settings), [Fonksiyon](#spec-function).

```go
contract Name {
    data{}
    settings{}
    func name(){}
}
```

### Veri {#spec-data}

`data` anahtar kelimesi, kısmen akıllı sözleşme veri girişini ve alınan form
parametrelerini tanımlar. `optional` parametrenin isteğe bağlı ve gerekli
olmadığını belirtir.

> `DataStmt` = `"data"` `"{"` { `ParamSign` } `"}"` .
>
> `ParamSign` = [Identifier](#spec-identifier) [Typename](#spec-typename) [ >
> `Tag` ] .
>
> `Tag` = `"optional"` .

`$` sembolünü kullanarak ilgili değişken değerini alın, bu sembol yalnızca
sözleşme içindeki [Fonksiyon](#spec-function) içinde kullanılmalıdır, bu
sözleşmenin global değişkenine eşdeğerdir. Bunu doğrudan kullanabilir veya
yeniden atayabilirsiniz.

```go
contract Name {
  data {
    Param1 string "optional"
  }
  func name(){
    $Param1 = 4
    Println($Param1)
  }
}
```

### Ayarlar {#spec-settings}

`settings` anahtar kelimesini kullanarak sabitleri bildirin, sabit değer türü
`int`, `float`, `string`, `bool` olabilir, bu mutlaka `contract` içinde
olmalıdır.

sabitlerin değeri yalnızca bir kez atanabilir ve sözleşmenin yürütülmesi
sırasında değiştirilemez.

> `SettingsStmt` = `"settings"` `SettingsScope` .
>
> `SettingsScope` = `"{"` [Identifier](#spec-identifier) `"="` (
> [Number Literal](#spec-number) | [String Literal](#spec-string) |
> [Boolean Literal](#spec-boolean) ) `"}"` .

```go
contract Name {
    settings {
      i = 1
      f = 1.2
      b = true
      s = "this is a string"
    }
}
```

### Fonksiyon {#spec-function}

Bu fonksiyon, akıllı sözleşmedeki [Veri](#spec-data) ve
[Ayarlar](#spec-settings)ı işler. Aritmetik, tip dönüşümü ve sözleşmeler arası
etkileşimlerin kurulması gibi işlemler gerçekleştirir.

#### Fonksiyon Bildirimi {#function-decl}

Fonksiyonlar, `func` anahtar kelimesi ile bildirilir, ardından fonksiyon adı,
parametreler, tip parametreleri, fonksiyon sonu, bir dönüş tipi ve son olarak
fonksiyon gövdesi gelir.

> `FuncDecl` = "func" FuncName `FuncSign` `FuncBody` .
>
> `FuncName` = [Identifier](#spec-identifier) .
>
> `FuncBody` = [CodeBlockStmt](#spec-codeblock) .
>
> `FuncSign` = [ `FuncParams` ] [ `FuncTail` ] [ `FuncResult` ] .
>
> `FuncParams` = `"("` [ `FuncParamList` ] `")"` .
>
> `FuncParamList` = `FuncParam` `{` `FuncParamSeq` `}` [ ( `","` | `" "` )
> [IdentifierList](#spec-identifier) `"..."` ] .
>
> `FuncParam` = [IdentifierList](#spec-identifier) [Typename](#spec-typename) .
>
> `FuncParamSeq` = ( `","` | `" "` ) `FuncParam` .
>
> `FuncResult` = [TypeList](#spec-typename) .
>
> `FuncTail` = `"."` [Identifier](#spec-identifier) [ `FuncParams` ] .

Fonksiyonun birden çok parametresi olabilir, her parametre bir parametre adı ve
tipi ile takip edilir, bir boşluk veya virgül ile ayrılır. Dönüş değeri parantez
`()` içine alınamaz ve dönüş tipi değişken adını bildiremez. Bir veya daha fazla
değeri döndürmek için `return` anahtar kelimesini kullanın.

```go
func Add(a b, c int, s string) int string{
    if a {
        return a + b + c, s
    }
    // invalid: missing return statement.
}
```

Eğer fonksiyon bir parametre listesi bildirmezse, fonksiyon imzasındaki
parantezler `()` atlanabilir ve bu durumda, fonksiyon adından sonra gelen tip
bildirimi sonuç parametresi olarak adlandırılır.

```go
func Get string{
    return "string"
}
```

Fonksiyon imzası, `...` kullanarak değişken parametrelerin tipini temsil
edebilir, bu son parametre olmalıdır ve veri tipi [dizi](#spec-typename)dir.
Değişken parametre, parametreyi geçmek için çağrıdan başlayarak tüm değişkenleri
içerir. Her türden değişken geçirilebilir, ancak veri türleriyle çakışmaların
ele alınması gereklidir.

```go
func sum(out string, values ...) {
    //...
}

func Name() {
   sum("Sum:", 10, "20", 30.3)
}
```

Fonksiyon, `return` ifadesiyle bir değer döndürse bile, bu değer diğer
sözleşmelere geçirilmez. Sözleşmenin dönüş değerini başka bir sözleşmeye
geçirmek istiyorsanız, dönüş değerini `$result` değişkenine atamanız
gerekmektedir.

```go
contract NameB {
    action {
        $result = 11
    }
}
contract NameA {
    action {
        var a int
        a = NameB()
    }
}
```

Eğer fonksiyon adı `action` veya `conditions` ise, `func` kelimesi atlanabilir.

```go
contract Name {
    action {}
    conditions {}
}
```

#### Kuyruk fonksiyonu {#tail-function}

Fonksiyonun birçok parametresi olabilir, ancak onları çağırırken yalnızca
bazılarını geçmek istersiniz. Bu durumda, bir nokta ile birden çok fonksiyon
bildirebilirsiniz, bu tür fonksiyonlara `kuyruk fonksiyonları` denir ve ardından
belirtilen parametreleri herhangi bir sırayla çağırabilirsiniz, onları
bildirilen sırayla çağırmak zorunda kalmazsınız. Bu tür bir fonksiyon
gövdesinde, bu parametreleri normal olarak kullanabilirsiniz. Parametre
geçilmezse, varsayılan değerler atanır. Kuyruk fonksiyonlarının dönüş değerleri
yoktur ve dönüş değerleri ana fonksiyonun bir parçasıdır.

```go
func myfunc(name string).Param1(p1 int).Param2(p2 string) int {
    //...
}
func Name{
    myfunc("name").Param2("p2")
}
```

Bir nokta kullanarak farklı fonksiyonlar çağrılabilir. Bir fonksiyon
çağrıldığında, bu fonksiyonun dönüş değeri bir sonraki fonksiyonun girişi olarak
kullanılabilir ve dönüş değeri tanımlama sırasına göre elde edilir. Birden çok
kuyruk fonksiyonu yalnızca ana fonksiyona görünür, diğer fonksiyonlara değil.
Kuyruk fonksiyonları ayrı ayrı çağrılamaz, ana fonksiyona veya ana fonksiyon
altındaki diğer kuyruk fonksiyonlarına bağlı olmalıdırlar.

```go
func A(int).tailA() int, string
func B(string,bool) string

func Name(){
    B("B",true).A(2)
    A(2).B(true).tailA()//invalid
    tailA() //invalid
}
```

## Sözdizimi temeli {#syntax-base}

Kaynak kod, UTF-8 kullanılarak kodlanmalıdır.

### Kod bloğu {#spec-codeblock}

Kıvırcık parantezler `{}` yerel değişkenleri içerebilecek bir kod bloğunu
belirtir. Kod bloğundaki değişkenler yalnızca kod bloğunda ve alt kod bloğunda
kullanılabilir. Fonksiyon gövdesi de bir kod bloğudur.

> `CodeBlockStmt` = `"{"` ... `"}"` .

Varsayılan olarak, bir kod bloğundaki değişkenler görünmez ve bir değişkenin
kapsamı alt kod bloğuna genişletilebilir. Bir kod bloğunda, mevcut bir
değişkenin adını yeni bir değişken tanımlamak için kullanabilirsiniz. Bu
nedenle, kapsamının dışında görünmez. Kapsam sona erdiğinde, değişken yok
edilir.

```go
contract Name {
    func block {
        var a int
        a = 3
        if ture {
            var a int
            a = 4
        }
    }
}
```

### Yorum {#spec-comment}

Yorumlar belgelendirme olarak kullanılabilir ve yorumların içeriği derleyici
tarafından görmezden gelinir. İki tür yorum vardır, biri **tek satır
yorumlarıdır**, diğeri ise **çok satırlı yorumlardır**.

1. Tek satır yorumlar `//` ile başlar ve satırın sonunda biter.

```go
func add(a int, b int) int {
    // This is a comment
    return a + b // This is also a comment
}
```

2. Çok satırlı yorumlar `/*` ile başlar ve `*/` ile biter. Çok satırlı yorumlar
   yeni satır karakterlerinden etkilenmez, birden çok satırı kapsayabilir ve her
   yerde yorum satırına alınabilir.

```go
func /*here*/a() {
   var b /*there*/ int
/*
here
*/
    b = /*there*/ 2
}
/*everywhere*/
```

### Yeni Satır {#spec-newline}

Yeni satır karakteri, ifadeler ve deyimler arasında bir ayırıcıdır ve yeni satır
karakteri bir noktalı virgül `;` ile değiştirilir, bu da birden çok ifadeyi veya
deyimi ayırmak için kullanılabilir.

```go
var a int
a = 1

//can be written as
var a int; as = 1
```

### Ayırıcı {#spec-delimiter}

Ayırıcılar, değişken adları, fonksiyon adları, tip adları vb. gibi
tanımlayıcıları ayırmak için kullanılır.

> `Delimiter` = `"("` | `")"` | `"{"` | `"}"` | `"["` | `"]"` | `"."` | `"," `|
> `"="` | `":"` .

### İfade {#spec-expression}

İfade, bir değeri hesaplayan bir ifadeyi ifade eder. Bir ifade, sabitler,
değişkenler, operatörler ve fonksiyonlardan oluşur. Hesaplama sonrası kesin bir
değer elde edilebilir. İfade değeri değiştirmez, sadece bir değeri hesaplar.

İfadelerin bazı örnekleri, sınırlı olmamakla birlikte:

- Metin katarları, sayısal literaller dahil olmak üzere literaller, örneğin:
  `100`, `3.14`, `"merhaba"`.
- Değişken adları, örneğin: `x`, `toplam`.
- Aritmetik ifadeler, örneğin: `1 + 2`, `a * b`.
- Fonksiyon çağrı ifadeleri, örneğin: `fnName()`.
- Karşılaştırma ifadeleri, örneğin: `a == b`, `puan > 90`.
- Mantıksal ifadeler, örneğin: `a && b`, `!tamamlandı`.
- Dizi, dilim, harita indeks ifadesi, örneğin: `dizi[2]`, `harita["anahtar"]`,
  `dilim[1:3]`.
- Tür dönüşüm ifadesi, örneğin: `Int(a)`.

İfadenin hesaplanmasıyla elde edilen değer, bir değişkene atanabilir, bir
fonksiyona parametre olarak kullanılabilir, diğer ifadelerle birleştirilerek
daha karmaşık ifadeler oluşturabilir ve if koşul ifadelerinde program akışını
kontrol etmek için kullanılabilir.

### Tanımlayıcı {#spec-identifier}

Tanımlayıcılar, değişkenleri, fonksiyonları, sabitleri ve diğer program adlarını
tanımlamak için kullanılır. Tanımlayıcılar bir veya daha fazla harften `A|a`'dan
`Z|z`'ye, sayılardan `0`'dan `9`'a ve alt çizgilerden `_` oluşur ve bir harfle
başlamalıdır. Tanımlayıcılar boşluk ve özel karakterler içeremez. Tanımlayıcılar
büyük-küçük harfe duyarlıdır ve [anahtar kelimeler](#spec-keyword) tanımlayıcı
olarak kullanılamaz.

> `Identifier` = `unicode_letter` `{` `letter` | `unicode_digit` `}`
>
> `letter` = `unicode_letter` | `"_"` .
>
> `unicode_letter` = // a Unicode code point classified as "Letter".
>
> `unicode_digit` = // a Unicode code point categorized as "Number, decimal
> digit".
>
> `IdentifierList` = `Identifier` `{` `IdentifierSeq` `}` .
>
> `IdentifierSeq` = ( `","` | `" "` ) `Identifier`

```go
a
x_123
αβ
```

Birden çok tanımlayıcı, virgül veya boşluklarla ayrılmış bir tanımlayıcı
listesine birleştirilebilir.

### Anahtar Kelime {#spec-keyword}

Aşağıdaki anahtar kelimeler ayrılmıştır ve [tanımlayıcılar](#spec-identifier)
olarak kullanılamaz.

|          |       |       |          |            |
| -------- | ----- | ----- | -------- | ---------- |
| contract | func  | data  | action   | conditions |
| return   | if    | elif  | else     | while      |
| var      | nil   | break | continue | settings   |
| true     | false | info  | warning  | error      |
| ...      |       |       |          |            |

### Sayı {#spec-number}

Sayısal literal değerler şunları içerir: `decimal` tam sayı, `binary` tam sayı,
`octal` tam sayı, `hexadecimal` tam sayı, ve kayan noktalı sayı ve bilimsel
notasyon.

İki temel tür vardır: `int` ve `float`. Eğer sayı bir ondalık nokta veya `eE`
içeriyorsa, bu bir **float** türüdür, standart IEEE-754 64-bit kayan noktalı
sayıya uyar, aksi takdirde bu bir **int** türüdür. int, Golang dilindeki int64'e
eşdeğerdir, ve float, Golang dilindeki float64'e eşdeğerdir.

> `int` = `DecimalLit` | `BinaryLit` | `OctalLit` | `HexLit` .
>
> `float` = `FloatLit` .
>
> `decimal_digit` = "0"..."9" .
>
> `binary_digit` = "01" .
>
> `octal_digit` = "0"..."7" .
>
> `hex_digit` = "0"..."9" | "A"..."F" | "a"..."f" .
>
> `binary_digits` = `binary_digit` `{` [ "_" ] `binary_digit`.`}` .
>
> `decimal_digits`= `decimal_digit` `{` [ "_" ] `decimal_digit`. `}` .
>
> `octal_digits` = `octal_digit` `{` [ "_" ] `octal_digit` `}` .
>
> `hex_digits` = `hex_digit` `{` [ "_" ] `hex_digit` `}` .
>
> `DecimalLit` = `decimal_digit` [ "_" ] `decimal_digits` .
>
> `BinaryLit` = "0" ( "b" | "B" ) [ "_" ] `binary_digits` .
>
> `OctalLit` = "0" ( "o" | "O" ) [ "_" ] `octal_digits` .
>
> `HexLit` = "0" ( "x" | "X" ) [ "_" ] `hex_digits` .
>
> `ExponentPart` = ( "e" | "E" ) [ "+" | "-" ] `decimal_digits` .
>
> `FloatLit` = `decimal_digits` "." [ `decimal_digits` ] [ `ExponentPart` ] |
> `decimal_digits` `ExponentPart` | "." `decimal_digits` [ `ExponentPart` ] .

```
0
123
0b101
0o123
0xaf
0.123
1.23e+2
.3e+2
```

### String {#spec-string}

String literalleri çift tırnak `"` veya backticks `` ` `` içinde olabilir, ve
backticks içindeki string literalleri birden çok satıra yayılabilir. Çift tırnak
içindeki string çift tırnak, yeni satır ve carriage return için kaçış dizileri
içerebilir. Backticks içindeki string kaçış yapılmaz.

> `StringLiteral` = `RawStringLiteral` | `InterpretedStringLiteral` .
>
> `RawStringLiteral` = ``"`"`` { `unicode_char` } ``"`"`` .
>
> `InterpretedStringLiteral` = `"` { `unicode_value` } `"` .
>
> `unicode_char` = // an arbitrary Unicode code point except newline.
>
> `unicode_value` = // an arbitrary Unicode code point.

```go
var str string
str = "This is \n a string"
str = `This is \n \t \r a other string`
```

### Boolean {#spec-boolean}

Bir boolean tipinin iki değeri vardır: `true` ve `false`. Bir ifadenin doğruluk
değerini temsil etmek için kullanılır.

> `Boolean` = "true" | "false" .

### Değişken {#spec-variable}

Değişkenler değerleri saklamak için kullanılır, ve değişkenler tarafından izin
verilen değerler türlerine göre belirlenir. Tür değişmez, ancak değer programın
çalışması sırasında değiştirilebilir.

#### Yerel Değişken {#local-variable}

`var` anahtar kelimesi yerel değişkenleri bildirmek için kullanılır, ve
değişkenin ardından bir değişken adı ve türü gelmelidir.

> `LocalVarDecl` = `"var"` [IdentifierList](#spec-identifier) >
> [Typename](#spec-typename) .

Bir değişkeni bildirirken, değeri varsayılan değerdir. Bir veya daha fazla
değişkeni bildirmek için, birden çok değişken adını ve türünü ayırmak için
virgül veya boşluk kullanabilirsiniz. İki veya daha fazla ardışık isimli formal
parametrenin türleri aynıysa, sonuncusu dışındaki tüm türler atlanabilir.

```go
var a int
var b b1, b2 string
var c bool, c1 float

b = "string"
b1, b2 = "string1", "string2"
c c1 = true 1.2
```

Değişkenler bildirildiğinde başlatılamaz ve bildirimden sonra atanmalıdır.

```go
// invalid
var a int = 1

// good
var a int
a = 1
```

`map` ve `array` tipleri, `{}` ve `[]` kullanarak aynı satırda birden çok
atamayı desteklemez, ancak aynı satırda birden çok atama, değişken adları
kullanılarak yapılabilir.

```go
var a b int c c1 map d d1 array
a, b = 1, 2
c,d = {"a":a, "b":b}, [1, 2, 3] //invalid
c = {"a":a, "b":b}
d = [1, 2, 3]
c1, d1 = c, d
d[0], d[1] = c, d //invalid
d[0], d[1] = d[1], d[0] //invalid
```

#### Global Değişken {#global-variable}

Anahtar sembol `$` ve [Identifier](#spec-identifier) global değişkenleri
bildirmek ve kullanmak için kullanılır. Sözdizimi aşağıdaki gibidir:

> `GlobalVarDecl` = `"$"` [Identifier](#spec-identifier) .

Global değişkenler tek bir sözleşme kapsamında herhangi bir fonksiyonda
bildirilebilir, ancak kullanılmadan önce bildirilmelidir. `data` bölümünde
tanımlanan parametreler aynı zamanda global değişkenlerdir, ancak yalnızca
mevcut sözleşme kapsamında kullanılabilir.

```go
contract Name {
    data {
        param int
    }
    func set() {
        $abc = 1
    }
    func get() int {
        $abc = $abc + $param
        return $abc
    }
}
```

#### Önceden Bildirilmiş Global Değişkenler {#predeclared-global-variables}

Önceden bildirilmiş global değişkenler herhangi bir sözleşme kapsamında
kullanılabilir ve bu global değişkenler derleme sırasında değiştirilemez olarak
belirtilebilir, bu varsayılan olarak değiştirilebilirdir.

Önceden bildirilmiş global değişkenler şunları içerir:

- `$original_contract` - İlk olarak işlemi işleyen sözleşmenin adı. Bu,
  değişkenin boş bir dize olması durumunda sözleşmenin işlem doğrulaması
  sırasında çağrıldığı anlamına gelir. Sözleşmenin başka bir sözleşme tarafından
  mı yoksa işlem tarafından mı doğrudan çağrıldığını kontrol etmek için,
  $original_contract ve $this_contract değerlerini karşılaştırmanız
  gerekmektedir. Eğer eşitlerse, sözleşmenin işlem tarafından çağrıldığı
  anlamına gelir.
- `$this_contract` - Şu anda yürütülmekte olan sözleşmenin adı.
- `$stack` - Tüm sözleşmeleri içeren bir [array](#spec-typename) veri tipine
  sahip sözleşme dizi yığını. Dizinin ilk öğesi, şu anda yürütülmekte olan
  sözleşmenin adını temsil ederken, son öğe işlemi ilk olarak işleyen
  sözleşmenin adını temsil eder.
- `$result` - Sözleşmenin dönüş sonucu ile atanır.

### Tip Adı {#spec-typename}

Tüm değişkenlerin tipleri vardır ve tip adları, değişkenlerin veri tiplerini
temsil etmek için kullanılır.

> `Type` = `Typename` | `TypeList` .
>
> `Typename` = "int" | "string" | "float" | "bool" | "bytes" | "address" |
> "money" | "array" | "map" | "file" .
>
> `TypeList` = `Typename` `{` ( "," | " " ) `Typename` `}` .

Aşağıdaki tip adları ayrılmıştır ve tanımlayıcı olarak kullanılamaz, Golang
dilindeki karşılık gelen tiplere eşdeğerdir.

- **int** - `int64`, sıfır değeri `0`.
- **string** - `string`, sıfır değeri `""`.
- **float** - `float64`, sıfır değeri `0.0`.
- **bool** - `bool`, sıfır değeri `false`.
- **bytes** - `[]byte`, sıfır değeri `[]byte`.
- **array** - `[]interface{}`, sıfır değeri `[]`.
- **map** - `map[string]interface{}`, sıfır değeri `map[]`.
- **address** - `int64`, sıfır değeri `0`.
- **money** - [decimal.Decimal](https://github.com/shopspring/decimal), sıfır
  değeri `0`.
- **file** - `map[string]interface{}`, sıfır değeri `map[]`.

#### Nesne ve dizi literalleri {#object-and-array-literals}

`array` ve `map` tipleri `[]` ve `{}` operatörleri veya belirtilen öğeler
kullanılarak oluşturulabilir.

`array` tipindeki indeks `int` olmalıdır. `map` tipindeki indeks `string`
olmalıdır. Eğer bir değer `array` öğesinin mevcut maksimum indeksinden daha
büyük bir indekse atanırsa, diziye boş bir öğe eklenir. Bu öğelerin başlangıç
değeri `nil`dir.

```go
var arr array m map
arr = [1,2,3]
arr[0] = 4
m = {"key": "value"}
m = {"key": myfunc()} // invalid
m = {"key": arr[0]} // invalid
m["key1"] = arr[5] // m["key1"] = nil
```

### Operatör {#spec-operator}

Bir işlem ifadesi bir operatör ve bir operanda oluşur. Needle, aşağıdaki işlem
operatörlerini destekler: aritmetik operatörler, karşılaştırma operatörleri,
mantıksal operatörler, bit düzeyinde operatörler ve atama operatörleri.

Aşağıda desteklenen operatörler bulunmaktadır:

- aritmetik operatörler: `+`, `-`, `*`, `/`, `%`, `++`, `--`.
- karşılaştırma operatörleri: `==`, `!=`, `>`, `>=`, `<`, `<=`.
- mantıksal operatörler: `&&`, `||`, `!`.
- bit düzeyinde operatörler: `&`, `|`, `^`, `<<`, `>>`.
- atama operatörleri: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`,
  `<<=`, `>>=`.

Operatörlerin önceliği yüksekten düşüğe doğrudur:

- `++`, `--`, `!`.
- `*`, `/`, `%`.
- `+`, `-`.
- `<<`, `>>`.
- `<`, `<=`, `>`, `>=`.
- `==`, `!=`.
- `&`.
- `^`.
- `|`.
- `&&`.
- `||`.
- `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`.

İşlemin sonuç türü, operandın türüyle aynıdır. Karşılaştırma operatörleri ve
mantıksal operatörler hariç, sonuç türleri `bool` olacaktır. Mantıksal
ifadelerde, operand türü varsayılan değer değilse, sonuç türü otomatik olarak
mantıksal bir değere dönüştürülür ve sonuç `true` olur.

`a += b`, `a = a + b` ile eşdeğerdir, `-=` , `*=` , `/=` , `%=` , `&=` , `|=` ,
`^=` , `<<=` , `>>=` de bu şekilde tanımlanmıştır. `a++`, `a += 1` ile
eşdeğerdir.

İki operandın türleri farklı olsa bile, Needle ifadelerde operatörlerin
kullanılmasına izin verir. Bu durumda, operandlar aynı türe dönüştürülür ve
ardından işlem gerçekleştirilir. Örneğin, `z = x + y` hesaplamak için, `x` `int`
türünde ve `y` `float` türünde ise, `x` ve `y` her ikisi de `decimal` türüne
dönüştürülür. Ardından toplama işlemi gerçekleştirilir ve sonuç `decimal`
türünde olup, `float` türüne dönüştürülür ve `z`'ye atanır.

Yüzer nokta işlemleri gerçekleştirilirken, hassasiyet kaybı sorununun dikkate
alınması gerektiğini belirtmek gerekir, yanlış sonuçlardan kaçınmak için.

Aşağıdaki, farklı türlerdeki operandlar arasındaki operatörleri ve sonuç
türlerini listeler:

| operand                       | x       | y       | z       |                            |
| ----------------------------- | ------- | ------- | ------- | -------------------------- |
| not(`!`)                      | -       |         | bool    | y to bool                  |
| unary(`+`,`-`)                | -       | int     | int     |                            |
|                               | -       | float   | float   |                            |
| `<<` , `>>`                   | int     | int     | int     |                            |
| `&`,`^`,`｜`                  | int     | int     | int     |                            |
| `++` , `--`                   | int     | int     | int     |                            |
| `+`,`-`,`*`,`/`,`%`           | string  | string  | string  | (only `+`)                 |
|                               | string  | int     | int     | x to int                   |
|                               | string  | float   | float   | x to decimal, y to decimal |
|                               | float   | string  | float   | x to decimal, y to decimal |
|                               | float   | int     | float   | x to decimal, y to decimal |
|                               | float   | float   | float   | x to decimal, y to decimal |
|                               | int     | string  | int     | y to int                   |
|                               | int     | int     | int     |                            |
|                               | int     | float   | float   | x to decimal, y to decimal |
|                               | decimal | string  | decimal | y to decimal               |
|                               | decimal | int     | decimal | y to decimal               |
|                               | decimal | float   | decimal | y to decimal               |
|                               | decimal | decimal | decimal |                            |
| `&&`,`\|\|`                   |         |         | bool    | x to bool, y to bool       |
| `==` ,`!=` ,`<`,`<=`,`>`,`>=` | nil     | nil     | bool    | only(`==` ,`!=`)           |
|                               | bool    | bool    | bool    | only(`==` ,`!=`)           |
|                               | string  | string  | bool    |                            |
|                               | string  | int     | bool    | y to string                |
|                               | string  | float   | bool    | y to string                |
|                               | string  | decimal | bool    | y to string                |
|                               | float   | string  | bool    | x to decimal, y to decimal |
|                               | float   | int     | bool    | x to decimal, y to decimal |
|                               | float   | float   | bool    | x to decimal, y to decimal |
|                               | float   | decimal | bool    | x to decimal               |
|                               | int     | string  | bool    | y to int                   |
|                               | int     | int     | bool    |                            |
|                               | int     | float   | bool    | x to decimal, y to decimal |
|                               | int     | decimal | bool    | y to int                   |
|                               | decimal | string  | bool    | y to decimal               |
|                               | decimal | int     | bool    | y to decimal               |
|                               | decimal | float   | bool    | y to decimal               |
|                               | decimal | decimal | bool    |                            |
|                               |         |         |         |                            |

### Dilim {#spec-slice}

Dilim işlemi yalnızca `array`, `string` ve `bytes` tiplerine uygulanır. Dilim
operatörü `[low:high]` bir dizinin bir kısmını almak için kullanılır.

```go
arr[low:high]
```

İndeks aralığının pozitif olması gerekmektedir. Eğer `0<=low<=high<=len(arr)`
ise, indeks aralığı geçerlidir, aksi takdirde indeks aralığı geçersizdir.
Kolaylık olması için, herhangi bir indeks atlanabilir. Atlanan indeks, dizinin
ilk indeksi veya son indeksi ile değiştirilecektir.

```go
var a b c d e array str strA string
a = [1,2,3,4,5]
b = a[1:3] // b = [2,3]
c = a[1:] // c = [2,3,4,5]
d = a[:3] // d = [1,2,3]
e = a[:] // e = [1,2,3,4,5]

str = "abcd"
strA = str[1:3] // strA = "bc"
```

### Artırma ve Azaltma {#spec-increment-and-decrement}

`++` ve `--` operatörleri, `int`, `float` ve `money` türündeki değişkenleri
artırır ve azaltır, bu da değişken değerini 1 artırabilir veya azaltabilir.

```go
var i int f float m money
i++
f--
m++
```

### Kontrol İfadesi {#spec-control-statement}

Kontrol ifadeleri, programın yürütme akışını kontrol etmek için kullanılır,
bunlar arasında return ifadeleri, if ifadeleri, while ifadeleri, break
ifadeleri, ve continue ifadeleri bulunur.

> `ControlStmt` = [ReturnStmt](#return-statement) | [IfStmt](#if-statement) |
> [WhileStmt](#while-statement) | [BreakStmt](#break-statement) |
> [ContinueStmt](#continue-statement) .

If ifadelerinde, boolean olmayan türlerden boolean türlere dönüşüm desteklenir.
Aşağıdaki kurallar boolean türlerini `false`'a dönüştürür, aksi takdirde `true`.
Yani, `if 1 {}` gibi bir kod geçerlidir.

- `int` ve `float`, `money`, `string`, `address` türündeki değerler sıfır
  değerine eşittir.
- `array` ve `map`, `bytes`, `file` türündeki değerler nil'e eşittir veya
  uzunlukları sıfırdır.

#### Return ifadesi {#return-statement}

`return` ifadesi, fonksiyonun yürütmesini erken sonlandırmak için fonksiyon
gövdesinde kullanılır. Eğer fonksiyon sonuç parametrelerini bildirirse, `return`
ifadesi aynı tür ve sayıda değer döndürmelidir.

> `ReturnStmt` = "return" [ExpressionList](#spec-expression) .

```go
func add(a , b int) int {
    return a + b
}
```

#### If ifadesi {#if-statement}

`if` ifadesi, kod bloğunu boolean ifadenin değerine göre yürütür. Eğer ifade
`true` olarak değerlendirilirse, `if` kod bloğu yürütülür, aksi takdirde `else`
kod bloğu yürütülür.

`elif` aslında `else if`'e eşdeğerdir, `else` ifadesinden önce tanımlanmalıdır.

> `IfStmt` = "if" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) { `ElIfStmtList` } [`ElseStmt`] .
>
> `ElIfStmtList` = "elif" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) .
>
> `ElseStmt` = "else" [CodeBlockStmt](#spec-codeblock) .

```go
if a > b {
    Println("a is greater than b")
} elif a == b {
    Println("a and b are equal")
} else {
    Println("b is greater than a")
}
```

#### while ifadesi {#while-statement}

`while` ifadesi, ifadenin `true` olarak değerlendirildiği sürece bir kod bloğunu
tekrar tekrar çalıştırma yeteneği sağlar. Koşul, her yineleme öncesi
değerlendirilir.

> `WhileStmt` = "while" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) .

```c
var a int
while a < 10 {
    a++
}
```

:::tip

Eğer koşul her zaman `true` ise, `while` ifadesi tekrar tekrar çalıştırılır. Bu
nedenle, bir noktada `false` olan bir koşul içermelidir.

:::

#### Break ifadesi {#break-statement}

`break` ifadesi, en içteki `while` ifadesini sonlandırır.

> `BreakStmt` = "break" .

```go
var a int
a = 1
while a < 10 {
    if a == 5 {
        break
    }
    a++
}
```

#### Continue ifadesi {#continue-statement}

`continue` ifadesi, en içteki `while` ifadesinin kalan kodunu atlar ve döngünün
bir sonraki yinelemesiyle devam eder.

> `ContinueStmt` = "continue" .

```go
var a int
a = 1
while a < 10 {
    if a == 5 {
        continue
    }
    a++
}
```
