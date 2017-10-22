
import theano
from theano import tensor as T
from theano.sandbox.rng_mrg import MRG_RandomStreams as RandomStreams
import numpy as np
from load import mnist
from scipy.misc import imsave

srng = RandomStreams()

def floatX(X):
    return np.asarray(X, dtype=theano.config.floatX)

def init_weights(shape):
    return theano.shared(floatX(np.random.randn(*shape) * 0.01))

def rectify(X):
    return T.maximum(X, 0.)

def softmax(X):
    e_x = T.exp(X - X.max(axis=1).dimshuffle(0, 'x'))
    return e_x / e_x.sum(axis=1).dimshuffle(0, 'x')

def RMSprop(cost, params, lr=0.001, rho=0.9, epsilon=1e-6):
    grads = T.grad(cost=cost, wrt=params)
    updates = []
    for p, g in zip(params, grads):
        acc = theano.shared(p.get_value() * 0.)
        acc_new = rho * acc + (1 - rho) * g ** 2
        gradient_scaling = T.sqrt(acc_new + epsilon)
        g = g / gradient_scaling
        updates.append((acc, acc_new))
        updates.append((p, p - lr * g))
    return updates

def dropout(X, p=0.):
    if p > 0:
        retain_prob = 1 - p
        X *= srng.binomial(X.shape, p=retain_prob, dtype=theano.config.floatX)
        X /= retain_prob
    return X

def model(X, w_h, w_h2, w_o, p_drop_input, p_drop_hidden):
    X = dropout(X, p_drop_input)
    h = rectify(T.dot(X, w_h))

    h = dropout(h, p_drop_hidden)
    h2 = rectify(T.dot(h, w_h2))

    h2 = dropout(h2, p_drop_hidden)
    py_x = softmax(T.dot(h2, w_o))
    return h, h2, py_x

trX, teX, trY, teY = mnist(onehot=True)

X = T.fmatrix()
Y = T.fmatrix()

w_h = init_weights((784, 625))
w_h2 = init_weights((625, 625))
w_o = init_weights((625, 10))

noise_h, noise_h2, noise_py_x = model(X, w_h, w_h2, w_o, 0.2, 0.5)
h, h2, py_x = model(X, w_h, w_h2, w_o, 0., 0.)
y_x = T.argmax(py_x, axis=1)

cost = T.mean(T.nnet.categorical_crossentropy(noise_py_x, Y))
params = [w_h, w_h2, w_o]
updates = RMSprop(cost, params, lr=0.001)

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
  imsave('img/modern_%s.png' % index, r)

def makeWH2Image():
  global index
  r = np.zeros((625, 625), dtype=np.uint8)
  w = w_h2.get_value(borrow=True)
  for y in range(25):
    for x in range(25):
      i = y*25 + x
      r[x*25:(x+1)*25,y*25:(y+1)*25] = ((w[:,i].reshape((25,25)) * 500).clip(-127, 127) + 127).round()
  imsave('img/modern_2_%s.png' % index, r)

def makeWOImage():
  global index
  r = np.zeros((250, 25), dtype=np.uint8)
  w = w_o.get_value(borrow=True)
  for x in range(10):
    r[x*25:(x+1)*25,:] = ((w[:,x].reshape((25,25)) * 500).clip(-127, 127) + 127).round()
  imsave('img/modern_out_%s.png' % index, r)

for i in range(5):
    for start, end in zip(range(0, len(trX), 128), range(128, len(trX), 128)):
        cost = train(trX[start:end], trY[start:end])
    makeWHImage()
    makeWH2Image()
    makeWOImage()
    index += 1
    print i, np.mean(np.argmax(teY, axis=1) == predict(teX))
