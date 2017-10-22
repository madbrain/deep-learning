import theano
from theano import tensor as T
import numpy as np
from load import mnist
from scipy.misc import imsave

def floatX(X):
    return np.asarray(X, dtype=theano.config.floatX)

def init_weights(shape):
    return theano.shared(floatX(np.random.randn(*shape) * 0.01))

def sgd(cost, params, lr=0.05):
    grads = T.grad(cost=cost, wrt=params)
    updates = []
    for p, g in zip(params, grads):
        updates.append([p, p - g * lr])
    return updates

def model(X, w_h, w_o):
    h = T.nnet.sigmoid(T.dot(X, w_h))
    pyx = T.nnet.softmax(T.dot(h, w_o))
    return pyx

trX, teX, trY, teY = mnist(onehot=True)

X = T.fmatrix()
Y = T.fmatrix()

w_h = init_weights((784, 625))
w_o = init_weights((625, 10))

py_x = model(X, w_h, w_o)
y_x = T.argmax(py_x, axis=1)

cost = T.mean(T.nnet.categorical_crossentropy(py_x, Y))
params = [w_h, w_o]
updates = sgd(cost, params)

train = theano.function(inputs=[X, Y], outputs=cost, updates=updates, allow_input_downcast=True)
predict = theano.function(inputs=[X], outputs=y_x, allow_input_downcast=True)

index = 0
def makeWHImage():
  global index
  r = np.zeros((700, 700), dtype=np.uint8)
  w = w_h.get_value(borrow=True)
  for y in range(25):
    for x in range(25):
      i = y*25 + x
      r[x*28:(x+1)*28,y*28:(y+1)*28] = ((w[:,i].reshape((28,28)) * 500).clip(-127, 127) + 127).round()
  imsave('img/old_%s.png' % index, r)

def makeWOImage():
  global index
  r = np.zeros((250, 25), dtype=np.uint8)
  w = w_o.get_value(borrow=True)
  for x in range(10):
    r[x*25:(x+1)*25,:] = ((w[:,x].reshape((25,25)) * 500).clip(-127, 127) + 127).round()
  imsave('img/old_out_%s.png' % index, r)

for i in range(5):
    for start, end in zip(range(0, len(trX), 128), range(128, len(trX), 128)):
        cost = train(trX[start:end], trY[start:end])
    makeWHImage()
    makeWOImage()
    index += 1
    print i, cost, np.mean(np.argmax(teY, axis=1) == predict(teX))
