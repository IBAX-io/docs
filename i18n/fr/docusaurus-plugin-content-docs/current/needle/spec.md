---
sidebar_position: 2
title: Spécification

toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Spécification de Needle {#needle-specification}

La Spécification de Needle est une description formelle du langage Needle. Elle
est destinée à être une référence pour les développeurs qui souhaitent
comprendre le langage en détail.

C'est un langage à typage statique avec une syntaxe qui est familière aux
développeurs qui ont de l'expérience avec golang.

## Structure de fichier {#file-structure}

Dans le langage Needle, la structure principale du bloc de code comprend
[Contrat Intelligent](#spec-contract), [Données](#spec-data),
[Fonction](#spec-function), [Paramètres](#spec-settings).

### Contract Intelligent {#spec-contract}

Utilisez le mot-clé `contract` pour déclarer un contrat intelligent, suivi du
nom du contrat intelligent, et son contenu doit être encadré par des accolades.

> `ContractStmt` = "contract" [Identifier](#spec-identifier) >
> [CodeBlockStmt](#spec-codeblock).

La structure du contrat intelligent a trois parties principales:
[Données](#spec-data), [Paramètres](#spec-settings), [Fonction](#spec-function).

```go
contract Name {
    data{}
    settings{}
    func name(){}
}
```

### Données {#spec-data}

Utilisez le mot-clé `data` pour décrire partiellement les données d'entrée du
contrat intelligent ainsi que les paramètres du formulaire reçus. Le `optional`
indique que le paramètre est facultatif et non obligatoire.

> `DataStmt` = `"data"` `"{"` { `ParamSign` } `"}"` .
>
> `ParamSign` = [Identifier](#spec-identifier) [Typename](#spec-typename) [ >
> `Tag` ] .
>
> `Tag` = `"optional"` .

Utilisez le symbole `$` pour obtenir la valeur de la variable correspondante, il
doit être utilisé dans la [Fonction](#spec-function) à l'intérieur du contrat,
il est équivalent à la variable globale du contrat. Vous pouvez l'utiliser
directement ou la réaffecter.

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

### Settings {#spec-settings}

Utilisez le mot-clé `settings` pour déclarer des constantes, le type de valeur
constante peut être `int`, `float`, `string`, `bool`, il doit être à l'intérieur
du `contract`.

La valeur des constantes ne peut être assignée qu'une seule fois, et ne peut pas
être modifiée pendant l'exécution du contrat.

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

### Fonction {#spec-function}

Cette fonction traite les [Data](#spec-data) et les [Settings](#spec-settings)
dans le contrat intelligent. Elle effectue des opérations telles que
l'arithmétique, la conversion de type, et établit des interactions entre les
contrats.

#### Déclaration de fonction {#function-decl}

Les fonctions sont déclarées avec le mot-clé `func` suivi du nom de la fonction,
des paramètres, des paramètres de type, de la queue de la fonction, d'un type de
retour et enfin du corps de la fonction.

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

La fonction peut avoir plusieurs paramètres, chaque paramètre est suivi d'un nom
et d'un type de paramètre, séparés par un espace ou une virgule. La valeur de
retour ne peut pas être enfermée dans des parenthèses `()`, et le type de retour
ne peut pas déclarer son nom de variable. Utilisez le mot-clé `return` pour
retourner une ou plusieurs valeurs.

```go
func Add(a b, c int, s string) int string{
    if a {
        return a + b + c, s
    }
    // invalid: missing return statement.
}
```

Si la fonction ne déclare pas de liste de paramètres, les parenthèses `()` dans
la signature de la fonction peuvent être omises, et dans ce cas, la déclaration
de type après le nom de la fonction est appelée le paramètre de résultat.

```go
func Get string{
    return "string"
}
```

La signature de la fonction peut utiliser `...` pour représenter le type de
paramètres variadiques, qui doit être le dernier paramètre, et son type de
données est [array](#spec-typename). Le paramètre variadique contient toutes les
variables à partir de l'appel pour passer le paramètre. Tout type de variable
peut être passé, mais les conflits avec les types de données doivent être gérés.

```go
func sum(out string, values ...) {
    //...
}

func Name() {
   sum("Sum:", 10, "20", 30.3)
}
```

Bien que la fonction renvoie une valeur via l'instruction `return`, elle ne sera
pas transmise à d'autres contrats. Si vous voulez transmettre la valeur de
retour du contrat à un autre contrat, vous devez assigner la valeur de retour à
la variable `$result`.

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

Si le nom de la fonction est `action` ou `conditions`, le `func` peut être omis.

```go
contract Name {
    action {}
    conditions {}
}
```

#### Fonctions de queue {#tail-function}

La fonction peut avoir de nombreux paramètres, mais lors de l'appel, vous voulez
peut-être n'en passer que certains. Dans ce cas, vous pouvez déclarer plusieurs
fonctions avec un point, ces fonctions sont appelées `fonctions de queue`, et
vous pouvez alors appeler les paramètres spécifiés dans n'importe quel ordre,
sans avoir à les appeler dans l'ordre déclaré. Dans un tel corps de fonction,
vous pouvez utiliser ces paramètres normalement. Si aucun paramètre n'est passé,
ils se verront attribuer des valeurs par défaut. Les fonctions de queue n'ont
pas de valeurs de retour, et les valeurs de retour font partie de la fonction
principale.

```go
func myfunc(name string).Param1(p1 int).Param2(p2 string) int {
    //...
}
func Name{
    myfunc("name").Param2("p2")
}
```

Différentes fonctions peuvent être appelées en utilisant un point. Lors de
l'appel d'une fonction, la valeur de retour de cette fonction peut être utilisée
comme entrée de la fonction suivante, et la valeur de retour est obtenue dans
l'ordre de définition. Plusieurs fonctions de queue ne sont visibles que pour la
fonction principale, pas pour les autres fonctions. Les fonctions de queue ne
peuvent pas être appelées séparément, elles doivent être connectées à la
fonction principale ou à d'autres fonctions de queue sous la fonction
principale.

```go
func A(int).tailA() int, string
func B(string,bool) string

func Name(){
    B("B",true).A(2)
    A(2).B(true).tailA()//invalid
    tailA() //invalid
}
```

## Syntaxe de base {#syntax-base}

Le code source doit être encodé en utilisant UTF-8.

### Bloc de code {#spec-codeblock}

Les accolades `{}` spécifient un bloc de code qui peut contenir des variables
locales. Les variables dans le bloc de code ne peuvent être utilisées que dans
le bloc de code et son sous-bloc de code. Le corps de la fonction est également
un bloc de code.

> `CodeBlockStmt` = `"{"` ... `"}"` .

Par défaut, les variables dans un bloc de code ne sont pas visibles, et la
portée d'une variable peut être étendue à son sous-bloc de code. Dans un bloc de
code, vous pouvez utiliser le nom d'une variable existante pour définir une
nouvelle variable. Par conséquent, elle n'est pas visible en dehors de sa
portée. Lorsque la portée se termine, la variable sera détruite.

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

### Commentaire {#spec-comment}

Les commentaires peuvent être utilisés comme documentation, et le contenu des
commentaires sera ignoré par le compilateur. Il existe deux types de
commentaires, l'un est les **commentaires sur une seule ligne**, et l'autre est
les **commentaires sur plusieurs lignes**.

1. Les commentaires sur une seule ligne commencent par `//` et se terminent à la
   fin de la ligne.

```go
func add(a int, b int) int {
    // This is a comment
    return a + b // This is also a comment
}
```

2. Les commentaires sur plusieurs lignes commencent par `/*` et se terminent par
   `*/`. Les commentaires sur plusieurs lignes ne sont pas affectés par les
   caractères de nouvelle ligne, peuvent s'étendre sur plusieurs lignes, et
   peuvent être commentés n'importe où.

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

### Nouvelle ligne {#spec-newline}

Le caractère de nouvelle ligne est un délimiteur entre les expressions et les
instructions, et le caractère de nouvelle ligne est remplacé par un
point-virgule `;`, qui peut être utilisé pour séparer plusieurs expressions ou
instructions.

```go
var a int
a = 1

//can be written as
var a int; as = 1
```

### Délimiteur {#spec-delimiter}

Les délimiteurs sont utilisés pour séparer les identifiants, tels que les noms
de variables, les noms de fonctions, les noms de types, etc.

> `Delimiter` = `"("` | `")"` | `"{"` | `"}"` | `"["` | `"]"` | `"."` | `"," `|
> `"="` | `":"` .

### Expression {#spec-expression}

L'expression fait référence à une déclaration qui calcule une valeur. Une
expression se compose de constantes, de variables, d'opérateurs et de fonctions.
Une valeur définie peut être obtenue après calcul. L'expression ne change pas la
valeur, elle calcule juste une valeur.

Voici quelques exemples d'expressions, sans s'y limiter :

- Les littéraux, y compris les littéraux de chaîne, les littéraux numériques,
  tels que : `100`, `3.14`, `"hello"`.
- Les noms de variables, tels que : `x`, `sum`.
- Les expressions arithmétiques, telles que : `1 + 2`, `a * b`.
- Les expressions d'appel de fonction, telles que : `fnName()`.
- Les expressions de comparaison, telles que : `a == b`, `score > 90`.
- Les expressions logiques, telles que : `a && b`, `!done`.
- L'expression d'index de tableau, de tranche, de carte, telle que : `array[2]`,
  `map["key"]`, `slice[1:3]`.
- L'expression de conversion de type, telle que : `Int(a)`.

La valeur obtenue en calculant l'expression peut être assignée à une variable,
utilisée comme paramètre d'une fonction, combinée avec d'autres expressions pour
former des expressions plus complexes, et utilisée dans des instructions
conditionnelles if pour contrôler le flux du programme.

### Identifiant {#spec-identifier}

Les identifiants sont utilisés pour identifier les variables, les fonctions, les
constantes et autres noms de programme. Les identifiants sont composés d'une ou
plusieurs lettres `A|a` à `Z|z`, de chiffres `0` à `9`, et de tirets bas `_`, et
doivent commencer par une lettre. Les identifiants ne peuvent pas contenir
d'espaces et de caractères spéciaux. Les identifiants sont sensibles à la casse
et ne peuvent pas utiliser les [mots-clés](#spec-keyword) comme identifiants.

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

Plusieurs identifiants peuvent être combinés en une liste d'identifiants,
séparés par des virgules ou des espaces.

### Mot-clé {#spec-keyword}

Les mots-clés suivants sont réservés et ne peuvent pas être utilisés comme
[identifiants](#spec-identifier).

|          |       |       |          |            |
| -------- | ----- | ----- | -------- | ---------- |
| contract | func  | data  | action   | conditions |
| return   | if    | elif  | else     | while      |
| var      | nil   | break | continue | settings   |
| true     | false | info  | warning  | error      |
| ...      |       |       |          |            |

### Nombre {#spec-number}

Les valeurs littérales de nombre comprennent : `decimal` entier, `binary`
entier, `octal` entier, `hexadecimal` entier, et nombre à virgule flottante et
notation scientifique.

Il existe deux types de base : `int` et `float`. Si le nombre contient un point
décimal ou `eE`, c'est un type **float**, qui est conforme à la norme IEEE-754
nombre à virgule flottante de 64 bits, sinon c'est un type **int**. int est
équivalent à int64 dans le langage Golang, et float est équivalent à float64
dans le langage Golang.

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

### Chaîne {#spec-string}

Les littéraux de chaîne peuvent être entourés de guillemets doubles `"` ou de
backticks `` ` ``, et les littéraux de chaîne entourés de backticks peuvent
s'étendre sur plusieurs lignes. La chaîne en guillemets doubles peut contenir
des séquences d'échappement pour les guillemets doubles, les nouvelles lignes,
et le retour chariot. La chaîne en backticks n'est pas échappée.

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

Un type boolean a deux valeurs : `true` et `false`. Il est utilisé pour
représenter la valeur de vérité d'une expression.

> `Boolean` = "true" | "false" .

### Variable {#spec-variable}

Les variables sont utilisées pour stocker des valeurs, et les valeurs autorisées
par les variables sont déterminées par leurs types. Le type est immuable, mais
la valeur peut être modifiée pendant l'exécution du programme.

#### Variable Locale {#variable-locale}

Le mot-clé `var` est utilisé pour déclarer des variables locales, et la variable
doit être suivie d'un nom de variable et d'un type.

> `LocalVarDecl` = `"var"` [IdentifierList](#spec-identifier) >
> [Typename](#spec-typename) .

Lors de la déclaration d'une variable, sa valeur est la valeur par défaut. Pour
déclarer une ou plusieurs variables, vous pouvez utiliser une virgule ou un
espace pour séparer plusieurs noms de variables et types. Lorsque les types de
deux ou plusieurs paramètres formels nommés consécutifs d'une fonction sont les
mêmes, tous les types sauf le dernier peuvent être omis.

```go
var a int
var b b1, b2 string
var c bool, c1 float

b = "string"
b1, b2 = "string1", "string2"
c c1 = true 1.2
```

Les variables ne peuvent pas être initialisées lors de la déclaration, et
doivent être assignées après la déclaration.

```go
// invalid
var a int = 1

// good
var a int
a = 1
```

Les types `map` et `array` ne supportent pas les affectations multiples sur la
même ligne en utilisant `{}` et `[]`, mais les affectations multiples sur la
même ligne peuvent être effectuées en utilisant les noms de variables.

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

#### Variable Globale {#global-variable}

Le symbole mot-clé `$` et [Identifier](#spec-identifier) sont utilisés pour
déclarer et utiliser des variables globales. La syntaxe est la suivante :

> `GlobalVarDecl` = `"$"` [Identifier](#spec-identifier) .

Les variables globales peuvent être déclarées dans n'importe quelle fonction à
l'intérieur d'une seule portée de contrat, mais doivent être déclarées avant
utilisation. Les paramètres définis dans la section `data` sont également des
variables globales, mais ne peuvent être utilisées que dans la portée du contrat
actuel.

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

#### Variables globales pré-déclarées {#predeclared-global-variables}

Les variables globales pré-déclarées peuvent être utilisées dans n'importe
quelle portée de contrat et ces variables globales peuvent être spécifiées comme
immuables lors de la compilation, qui est mutable par défaut.

Les variables globales pré-déclarées incluent :

- `$original_contract` - nom du contrat qui a initialement traité le
  transaction. Cela signifie que le contrat est appelé pendant la validation de
  la transaction si la variable est une chaîne vide. Pour vérifier si le contrat
  est appelé par un autre contrat ou directement par la transaction, vous devez
  comparer les valeurs de $original_contract et $this_contract. Cela signifie
  que le contrat est appelé par la transaction s'ils sont égaux.
- `$this_contract` - nom du contrat actuellement en cours d'exécution.
- `$stack` - pile de tableau de contrats avec un type de données de
  [array](#spec-typename), contenant tous les contrats exécutés. Le premier
  élément du tableau représente le nom du contrat actuellement en cours
  d'exécution, tandis que le dernier élément représente le nom du contrat qui a
  initialement traité la transaction.
- `$result` - assigné avec le résultat de retour du contrat.

### Nom de type {#spec-typename}

Toutes les variables ont des types, et les noms de type sont utilisés pour
représenter les types de données des variables.

> `Type` = `Typename` | `TypeList` .
>
> `Typename` = "int" | "string" | "float" | "bool" | "bytes" | "address" |
> "money" | "array" | "map" | "file" .
>
> `TypeList` = `Typename` `{` ( "," | " " ) `Typename` `}` .

Les noms de type suivants sont réservés et ne peuvent pas être utilisés comme
identifiants, équivalents aux types correspondants dans le langage Golang.

- **int** - `int64`, la valeur zéro est `0`.
- **string** - `string`, la valeur zéro est `""`.
- **float** - `float64`, la valeur zéro est `0.0`.
- **bool** - `bool`, la valeur zéro est `false`.
- **bytes** - `[]byte`, la valeur zéro est `[]byte`.
- **array** - `[]interface{}`, la valeur zéro est `[]`.
- **map** - `map[string]interface{}`, la valeur zéro est `map[]`.
- **address** - `int64`, la valeur zéro est `0`.
- **money** - [decimal.Decimal](https://github.com/shopspring/decimal), la
  valeur zéro est `0`.
- **file** - `map[string]interface{}`, la valeur zéro est `map[]`.

#### Littéraux d'objet et de tableau {#object-and-array-literals}

Les types `array` et `map` peuvent être créés en utilisant les opérateurs `[]`
et `{}` ou des éléments spécifiés.

L'index du type `array` doit être `int`. L'index du type `map` doit être
`string`. Si une valeur est assignée à un index supérieur à l'index maximum
actuel de l'élément `array`, un élément vide sera ajouté au tableau. La valeur
d'initialisation de ces éléments est `nil`.

```go
var arr array m map
arr = [1,2,3]
arr[0] = 4
m = {"key": "value"}
m = {"key": myfunc()} // invalid
m = {"key": arr[0]} // invalid
m["key1"] = arr[5] // m["key1"] = nil
```

### Opérateur {#spec-operator}

Une expression d'opération se compose d'un opérateur et d'un opérande. Needle
prend en charge les opérateurs d'opération suivants : opérateurs arithmétiques,
opérateurs de comparaison, opérateurs logiques, opérateurs bit à bit et
opérateurs d'affectation.

Voici les opérateurs actuellement pris en charge :

- opérateurs arithmétiques : `+`, `-`, `*`, `/`, `%`, `++`, `--`.
- opérateurs de comparaison : `==`, `!=`, `>`, `>=`, `<`, `<=`.
- opérateurs logiques : `&&`, `||`, `!`.
- opérateurs bit à bit : `&`, `|`, `^`, `<<`, `>>`.
- opérateurs d'affectation : `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`,
  `^=`, `<<=`, `>>=`.

La priorité des opérateurs est de haut en bas :

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

Le type de résultat de l'opération est le même que le type de l'opérande. Sauf
pour les opérateurs de comparaison et les opérateurs logiques, leur type de
résultat est `bool`. Dans les expressions logiques, le type de résultat sera
automatiquement converti en une valeur logique, si le type de l'opérande n'est
pas la valeur par défaut, et le résultat est `true`.

`a += b` est équivalent à `a = a + b`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`,
`<<=`, `>>=` sont également définis de cette manière. `a++` est équivalent à
`a += 1`.

Même si les types des deux opérandes sont différents, Needle permet
l'utilisation de opérateurs dans les expressions. Dans ce cas, les opérandes
seront convertis au même type puis l'opération sera effectuée. Par exemple, pour
calculer `z = x + y`, où `x` est de type `int` et `y` est de type `float`, `x`
et `y` seront tous deux convertis en type `decimal`. Ensuite, l'opération
d'addition est effectuée, et le résultat est de type `decimal`, qui est ensuite
converti en type `float` et assigné à `z`.

Il convient de noter que lors de l'exécution d'opérations à virgule flottante,
la question de la perte de précision doit être prise en compte pour éviter des
résultats incorrects.

La liste suivante présente les opérateurs et les types de résultats entre les
opérandes de différents types :

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

### Tranche {#spec-slice}

L'opération de tranche s'applique uniquement aux types `array`, `string` et
`bytes`. L'opérateur de tranche `[low:high]` est utilisé pour obtenir une partie
du tableau.

```go
arr[low:high]
```

La plage de l'index doit être positive. Si `0<=low<=high<=len(arr)`, la plage
d'index est valide, sinon la plage d'index est invalide. Pour plus de commodité,
n'importe quel index peut être omis. L'index omis sera remplacé par le premier
index ou le dernier index du tableau.

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

### Incrémentation et décrémentation {#spec-increment-and-decrement}

`++` et `--` incrémentent et décrémentent les variables de type `int`, `float`,
et `money`, qui peuvent augmenter ou diminuer la valeur de la variable de 1.

```go
var i int f float m money
i++
f--
m++
```

### Instruction de contrôle {#spec-control-statement}

Les instructions de contrôle sont utilisées pour contrôler le flux d'exécution
du programme, y compris les instructions return, if, while, break, et continue.

> `ControlStmt` = [ReturnStmt](#return-statement) | [IfStmt](#if-statement) |
> [WhileStmt](#while-statement) | [BreakStmt](#break-statement) |
> [ContinueStmt](#continue-statement) .

Dans les instructions if, la conversion des types non booléens en types booléens
est supportée. Les règles suivantes convertissent les types booléens en `false`,
sinon `true`. Ainsi, le code comme `if 1 {}` est valide.

- Les valeurs de type `int` et `float`, `money`, `string`, `address` sont égales
  à la valeur zéro.
- Les valeurs de type `array` et `map`, `bytes`, `file` sont égales à nil ou
  leur longueur est zéro.

#### Instruction return {#return-statement}

L'instruction `return` est utilisée dans le corps de la fonction pour terminer
l'exécution de la fonction prématurément. Si la fonction déclare des paramètres
de résultat, le l'instruction `return` doit renvoyer le même type et le même
nombre de valeurs.

> `ReturnStmt` = "return" [ExpressionList](#spec-expression) .

```go
func add(a , b int) int {
    return a + b
}
```

#### Instruction if {#if-statement}

L'instruction `if` exécute le bloc de code en fonction de la valeur de
l'expression booléenne. Si l'expression évalue à `true`, le bloc de code `if`
est exécuté, sinon le bloc de code `else` est exécuté.

`elif` est en fait équivalent à `else if`, il doit être défini avant
l'instruction `else`.

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

#### Instruction while {#while-statement}

L'instruction `while` offre la possibilité d'exécuter à plusieurs reprises un
bloc de code tant que l'expression évalue à `true`. La condition est évaluée
avant chaque itération.

> `WhileStmt` = "while" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) .

```c
var a int
while a < 10 {
    a++
}
```

:::tip

Si la condition est toujours `true`, l'instruction `while` sera exécutée à
plusieurs reprises. Par conséquent, elle devrait inclure une condition qui est
`false` à un certain moment.

:::

#### Instruction break {#break-statement}

L'instruction `break` termine l'instruction `while` la plus interne.

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

#### Instruction continue {#continue-statement}

L'instruction `continue` saute le code restant de l'instruction `while` la plus
interne et continue avec la prochaine itération de la boucle.

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
