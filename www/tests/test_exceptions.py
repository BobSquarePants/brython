import io
import traceback
import re

from tester import assert_raises

src = """def f():
  f()

f()"""

expected = """  File "<string>", line 4, in <module>
  File "<string>", line 2, in f
  File "<string>", line 2, in f
  File "<string>", line 2, in f"""

try:
    exec(src)
except RecursionError as exc:
    out = io.StringIO()
    traceback.print_exc(file=out)
    trace = out.getvalue()
    assert expected in trace
    assert re.search(r"[Previous line repeated \d+ more times]", trace)
    assert "RecursionError: maximum recursion depth exceeded" in trace

src = """x = 0

def f():
    global x
    x += 1
    if x < 10:
        f()
    1 / 0
f()"""

expected = """  File "<string>", line 9, in <module>
  File "<string>", line 7, in f
  File "<string>", line 7, in f
  File "<string>", line 7, in f
  [Previous line repeated 6 more times]
  File "<string>", line 8, in f
ZeroDivisionError: division by zero"""

try:
    exec(src)
except ZeroDivisionError as exc:
    out = io.StringIO()
    traceback.print_exc(file=out)
    trace = out.getvalue()
    assert expected in trace

# PEP 654 (Exception Groups and except*)

assert_raises(TypeError,
    ExceptionGroup,
    'issues',
    [ValueError('bad value'), BaseException('base')],
    msg = 'Cannot nest BaseExceptions in an ExceptionGroup')

e = BaseExceptionGroup('issues',
        [ValueError('bad value'), TypeError('bad type')])
assert type(e) is ExceptionGroup

source = "def myfunc():\n error"
code = compile(source, 'foo.py', 'exec')
exec(code)
expected = """File "foo.py", line 2, in myfunc"""

try:
    myfunc()
except NameError as exc:
    import traceback
    import io
    out = io.StringIO()
    traceback.print_exc(file=out)
    assert expected in out.getvalue()

# issue
ne = NameError('dero')
assert str(ne) == 'dero'

try:
  dero
except NameError as exc:
  assert exc.name == 'dero'
  assert exc.args[0] == "name 'dero' is not defined"
  assert str(exc) == exc.args[0]

class A:
  def __init__(self):
    self.attribute = 0

a = A()
try:
  a.atribute
except AttributeError as exc:
  assert exc.args[0] == str(exc) == "'A' object has no attribute 'atribute'"
  assert exc.obj == a

