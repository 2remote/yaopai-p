# photographer模块

photographer模块包含与摄影师相关的所有内容，包括（可能更多）

**数据流(Reflux)**

- Reflux actions
- Reflux stores
- functions: 从函数式编程的思路出发，抽象出的数据处理函数

**React组件**

- auth: 认证相关组件
- info: 信息相关组件
- album: 作品相关组件

## 关于命名

photographer使用缩写 ***PG*** 命名

## Reflux Actions

Actions本身是用来修改Stores内的数据的，大部分是处理Async类的请求。Actions循序以下开发思路：

1. Actions负责Async请求的request发起，结果的处理（包括异常），尤其是数据入Store之前转换格式
2. Actions提供的API命名采用小写，并针对JS开发习惯调整命名
3. Actions基本与后台API的分组保持一直

## Reflux stores

Stores本身用来存储App内部的数据，并大致遵循以下思路：

1. Stores仅监听Actions的数据（针对Reflux框架细节，暂时不用Store监听其他Store）
2. Stores认为从Actions获取到的数据是已经转换过的，统一的数据
3. Stores内部负责数据的存储细节，trigger的数据借鉴函数式编程思想，返回实际数据的副本

## functions

从React开发流程中流行起数据流和函数式编程思想之后，所有重要的数据处理不再是OOP的数据封装，而是函数解析。

functions包含以下内容：

1. 服务器端数据转换到本地数据结构（数据unload）
2. 本地数据转换成服务器端API要求的结构（数据load）
3. 部分简单的数据不实用函数（直接在Actions的request data中转换）
4. 提供给App内部其他组件、部分调用

## 组件

组件基本是按照React推荐的Container/Representation Components的分类来隔离，但是并不100%严格遵守
