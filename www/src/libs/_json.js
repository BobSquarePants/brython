var $module=(function($B){

var _b_ = $B.builtins

function simple(obj){
    switch(typeof obj){
        case 'string':
        case 'number':
        case 'boolean':
            return true
    }
    if(obj instanceof Number ||
            Array.isArray(obj) ||
            _b_.isinstance(obj, [_b_.list, _b_.tuple, _b_.dict])){
        return true
    }
    return false
}

function to_json(obj, level){
    var $defaults = {skipkeys:_b_.False, ensure_ascii:_b_.True,
            check_circular:_b_.True, allow_nan:_b_.True, cls:_b_.None,
            indent:_b_.None, separators:_b_.None, "default":_b_.None,
            sort_keys:_b_.False},
        $ = $B.args("to_json", 2, {obj: null, level: null}, ['obj', 'level'],
                    arguments, {level: 1}, null, "kw"),
        kw = $.kw.$string_dict

    for(key in $defaults){
        if(kw[key] === undefined){
            kw[key] = $defaults[key]
        }else{
            kw[key] = kw[key][0]
        }
    }

    var indent = kw.indent,
        ensure_ascii = kw.ensure_ascii,
        separators = kw.separators === _b_.None ?
             kw.indent === _b_.None ? [', ', ': '] : [',', ': '] :
            kw.separators,
        skipkeys = kw.skipkeys,
        _default = kw.default,
        sort_keys = kw.sort_keys,
        allow_nan = kw.allow_nan,
        check_circular = kw.check_circular
    var item_separator = separators[0],
        key_separator = separators[1]
    if(indent !== _b_.None){
        var indent_str
        if(typeof indent == "string"){
            indent_str = indent
        }else if(typeof indent == "number" && indent >= 1){
            indent_str = " ".repeat(indent)
        }else{
            throw _b_.ValueError.$factory("invalid indent: " +
                _b_.str.$factory(indent))
        }
    }
    var kwarg = {$nat: "kw", kw: {}}
    for(var key in kw){
        kwarg.kw[key] = kw[key]
    }
    switch(typeof obj){
        case 'string':
            var res = JSON.stringify(obj)
            if(ensure_ascii){
                var escaped = ''
                for(var i = 0, len = res.length; i < len; i++){
                    var u = res.codePointAt(i)
                    if(u > 127){
                        u = u.toString(16)
                        while(u.length < 4){
                            u = "0" + u
                        }
                        escaped += '\\u' + u
                    }else{
                        escaped += res.charAt(i)
                    }
                }
                return escaped
            }
            return res
        case 'boolean':
            return obj.toString()
        case 'number':
            if([Infinity, -Infinity].indexOf(obj) > -1 ||
                    isNaN(obj)){
                if(! allow_nan){
                    throw _b_.ValueError.$factory(
                        'Out of range float values are not JSON compliant')
                }
            }
            return obj.toString()
    }
    if(_b_.isinstance(obj, _b_.list)){
        var res = []
        var sep = item_separator,
            first = '[',
            last = ']'
        if(indent !== _b_.None){
            sep += "\n" + indent_str.repeat(level)
            first = '[' + '\n' + indent_str.repeat(level)
            last = '\n' + indent_str.repeat(level - 1) + ']'
            level++
        }
        for(var i = 0, len = obj.length; i < len; i++){
            res.push(to_json(obj[i], level, kwarg))
        }
        return first + res.join(sep) + last
    }else if(obj instanceof Number){
        return obj.valueOf()
    }else if(obj === _b_.None){
        return "null"
    }else if(_b_.isinstance(obj, _b_.dict)){
        var res = [],
            items = $B.dict_to_list(obj)
        if(sort_keys){
            // Sort keys by alphabetical order
            items.sort()
        }
        var sep = item_separator,
            first = '{',
            last = '}'
        if(indent !== _b_.None){
            sep += "\n" + indent_str.repeat(level)
            first = '{' + '\n' + indent_str.repeat(level)
            last = '\n' + indent_str.repeat(level - 1) + '}'
            level++
        }
        for(var i = 0, len = items.length; i < len; i++){
            var item = items[i]
            if(! simple(item[0])){
                if(! skipkeys){
                    throw _b_.TypeError.$factory("keys must be str, int, " +
                        "float, bool or None, not " + $B.class_name(obj))
                }
            }else{
                // In the result, key must be a string
                var key = _b_.str.$factory(item[0])
                // Check circular reference
                if(check_circular && $B.repr.enter(item[1])){
                    throw _b_.ValueError.$factory("Circular reference detected")
                }
                res.push(
                    [to_json(key, level, kwarg), to_json(item[1], level, kwarg)].
                    join(key_separator))
                if(check_circular){
                    $B.repr.leave(item[1])
                }
            }
        }
        return first + res.join(sep) + last
    }
    // For other types, use function default if provided
    if(_default == _b_.None){
        throw _b_.TypeError.$factory("Object of type " + $B.class_name(obj) +
            " is not JSON serializable")
    }else{
        return to_json($B.$call(_default)(obj), level, kwarg)
    }
}

function loads(s){
    var args = []
    for(var i = 1, len = arguments.length; i < len; i++){
        args.push(arguments[i])
    }
    var decoder = JSONDecoder.$factory.apply(null, args)
    return JSONDecoder.decode(decoder, s)
}

function to_py(obj, kw){
    // Conversion to Python objects
    // kw are the keyword arguments to loads()
    var res
    if(obj instanceof List){
        return obj.items.map(x => to_py(x, kw))
    }else if(obj instanceof Dict){
        if(kw.object_pairs_hook !== _b_.None){
            var pairs = []
            for(var i = 0, len = obj.keys.length; i < len; i++){
                pairs.push($B.fast_tuple([obj.keys[i],
                    to_py(obj.values[i], kw)]))
            }
            return $B.$call(kw.object_pairs_hook)(pairs)
        }else{
            var dict = $B.empty_dict()
            for(var i = 0, len = obj.keys.length; i < len; i++){
                _b_.dict.$setitem(dict, obj.keys[i], to_py(obj.values[i], kw))
            }

            return kw.object_hook === _b_.None ? dict :
                $B.$call(kw.object_hook)(dict)
        }
    }else{
        if(obj instanceof Number && kw.parse_float !== _b_.None){
            return $B.$call(kw.parse_float)(obj)
        }else if(kw.parse_int !== _b_.None &&
                (typeof obj == 'number' || obj.__class__ === $B.long_int)){
            return $B.$call(kw.parse_int)(obj)
        }else if(kw.parse_constant !== _b_.None && ! isFinite(obj)){
            return kw.parse_constant(obj)
        }
        return obj
    }
}


function string_at(s, i){
    var error = $B.$call($B.imported["json"].JSONDecodeError)

    var j = i + 1,
        escaped = false,
        len = s.length
    while(j < len){
        if(s[j] == '"' && ! escaped){
            return [{type: 'str', value: s.substring(i + 1, j)}, j + 1]
        }else if(s[j] == '\\'){
            escaped = ! escaped
            j++
        }else if(escaped){
            console.log('escaped', s[j])
            if('"/bfn'.indexOf(s[j]) > -1){
                j++
                escaped = ! escaped
            }else{
                throw error('invalid escape "' + s[j] + '"', s, j)
            }
        }else{
            j++
        }
    }
}

function to_num(num_string, nb_dots, exp){
    // convert to correct Brython type
    if(exp || nb_dots){
        return new Number(num_string)
    }else{
        var int = parseInt(num_string)
        if(Math.abs(int) < $B.max_int){
            return int
        }else{
            if(num_string.startsWith('-')){
                return $B.fast_long_int(num_string.substr(1), false)
            }else{
                return $B.fast_long_int(num_string, true)
            }
        }
    }
}

function num_at(s, i){
  var res = s[i],
      j = i + 1,
      nb_dots = 0,
      exp = false,
      len = s.length
  while(j < len){
      if(s[j].match(/\d/)){
        j++
      }else if(s[j] == '.' && nb_dots == 0){
        nb_dots++
        j++
      }else if('eE'.indexOf(s[j]) > -1 && ! exp){
        exp = ! exp
        j++
      }else{
        return [{type: 'num', value: to_num(s.substring(i, j), nb_dots, exp)}, j]
      }
  }
  return [{type: 'num', value: to_num(s.substring(i, j), nb_dots, exp)}, j]
}

function* tokenize(s){
  var i = 0,
      len = s.length,
      value,
      end
  while(i < len){
    if(s[i] == " " || s[i] == '\r' || s[i] == '\n'){
      i++
    }else if('[]{}:,'.indexOf(s[i]) > -1){
      yield [s[i], i]
      i++
    }else if(s.substr(i, 4) == 'null'){
      yield [_b_.None , i]
      i += 4
    }else if(s.substr(i, 4) == 'true'){
      yield [true, i]
      i += 4
    }else if(s.substr(i, 5) == 'false'){
      yield [false, i]
      i += 5
    }else if(s.substr(i, 8) == 'Infinity'){
      yield [{type: 'num', value: Number.POSITIVE_INFINITY}, i]
      i += 8
    }else if(s.substr(i, 9) == '-Infinity'){
      yield [{type: 'num', value: Number.NEGATIVE_INFINITY}, i]
      i += 9
    }else if(s.substr(i, 3) == 'NaN'){
      yield [{type: 'num', value: NaN}, i]
      i += 3
    }else if(s[i] == '"'){
      value = string_at(s, i)
      yield value
      i = value[1]
    }else if(s[i].match(/\d/) || s[i] == '-'){
      value = num_at(s, i)
      yield value
      i = value[1]
    }else{
      throw Error('unexpected: ' + s[i] + s.charCodeAt(i))
    }
  }
}

function Node(parent){
    this.parent = parent
    if(parent instanceof List){
        this.list = parent.items
    }else if(parent instanceof Dict){
        this.list = parent.values
    }else if(parent === undefined){
        this.list = []
    }
}

Node.prototype.transition = function(token){
    if([true, false, _b_.None].indexOf(token) > -1 ||
            ['str', 'num'].indexOf(token.type) > -1){
        if(this.parent === undefined &&
                (this.list.length > 0 || this.content)){
            throw Error('Extra data')
        }
        this.list.push(token.type ? token.value : token)
        return this.parent ? this.parent : this
    }else if(token == '{'){
        if(this.parent === undefined){
          this.content = new Dict(this)
          return this.content
        }
        return new Dict(this.parent)
    }else if(token == '['){
        if(this.parent === undefined){
            this.content = new List(this)
            return this.content
        }
        return new List(this.parent)
    }else{
        throw Error('unexpected item:' + token)
    }
}

function Dict(parent){
    this.parent = parent
    this.keys = []
    this.values = []
    this.expect = 'key'
    if(parent instanceof List){
        parent.items.push(this)
    }else if(parent instanceof Dict){
        parent.values.push(this)
    }
}

Dict.prototype.transition = function(token){
    if(this.expect == 'key'){
        if(token.type == 'str'){
            this.keys.push(token.value)
            this.expect = ':'
            return this
        }else if(token == '}' && this.keys.length == 0){
            return this.parent
        }else{
            throw Error('expected str')
        }
    }else if(this.expect == ':'){
        if(token == ':'){
          this.expect = '}'
          return new Node(this)
        }else{
          throw Error('expected :')
        }
    }else if(this.expect == '}'){
        if(token == '}'){
            return this.parent
        }else if(token == ','){
            this.expect = 'key'
            return this
        }
        throw Error('expected }')
    }
}

function List(parent){
    if(parent instanceof List){
        parent.items.push(this)
    }
    this.parent = parent
    this.items = []
    this.expect = 'item'
}

List.prototype.transition = function(token){
    if(this.expect == 'item'){
        this.expect = ','
        if([true, false].indexOf(token) > -1){
            this.items.push(token)
            return this
        }else if(token.type == 'num' || token.type == 'str'){
            this.items.push(token.value)
            return this
        }else if(token == '{'){
            return new Dict(this)
        }else if(token == '['){
            return new List(this)
        }else if(token == ']'){
            if(this.items.length == 0){
                return this.parent
            }
            throw Error('unexpected ]')
        }else{
            console.log('token', token)
            throw Error('unexpected item:' + token)
        }

    }else if(this.expect == ','){
        this.expect = 'item'
        if(token == ','){
          return this
        }else if(token == ']'){
          if(this.parent instanceof Dict){
              this.parent.values.push(this)
          }
          return this.parent
        }else{
          throw Error('expected :')
        }
    }
}

function parse(s){
  var res,
      state,
      node = new Node(),
      root = node,
      token
  for(var item of tokenize(s)){
      token = item[0]
      try{
          node = node.transition(token)
      }catch(err){
          if(err.__class__){
              throw err
          }else{
              var error = $B.$call($B.imported["json"].JSONDecodeError)
              throw error(err.message, s, item[1])
          }
      }
  }
  return root.content ? root.content : root.list[0]
}

var JSONDecoder = $B.make_class("JSONDecoder",
    function(){
        var $defaults = {cls: _b_.None, object_hook: _b_.None,
                parse_float: _b_.None, parse_int: _b_.None,
                parse_constant: _b_.None, object_pairs_hook: _b_.None},
            $ = $B.args("decode", 0, {}, [], arguments, {}, null, "kw")
        var kw = {}
        for(var key in $.kw.$string_dict){
            kw[key] = $.kw.$string_dict[key][0]
        }
        for(var key in $defaults){
            if(kw[key] === undefined){
                kw[key] = $defaults[key]
            }
        }
        return {
            __class__: JSONDecoder,
            object_hook: kw.object_hook,
            parse_float: kw.parse_float,
            parse_int: kw.parse_int,
            parse_constant: kw.parse_constant,
            object_pairs_hook: kw.object_pairs_hook,
            memo: $B.empty_dict()
        }
    }
)

JSONDecoder.decode = function(self, s){
    return to_py(parse(s), self)
}

return {
    dumps: function(){
        return _b_.str.$factory(to_json.apply(null, arguments))
    },
    loads,
    JSONDecoder
}

})(__BRYTHON__)