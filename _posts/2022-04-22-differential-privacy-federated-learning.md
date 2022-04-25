---
layout: blogpost
title: Applying Differential Privacy to Federated Learning
summary: How differential privacy was applied to the federated experiment on the Synthea/CodeX dataset
image: /img/posts/dp-fl-experiments/differential-privacy.png
author: Laiba Zaman
date: 2022-04-22
---

<!-- The code for table styling was copied from Courtney Gosselin's blog post markdown file. https://github.com/CanDIG/candig.github.io/blob/production/_posts/2022-02-18-introduction-to-figma-and-design-principles.md -->

<style> 
table { 
    width: 100%; 
    border-collapse: collapse; 
}

th { 
    background: #17a018; 
    color: white; 
}

table, th, td { 
    padding: 0.5em; 
    margin: 0.5em; 
}

table tr:hover { 
    background: #D6EEDC; 
}

table tr:nth-child(even){ 
    background: #f2f2f2; 
} 
</style>

Federated learning has many applications, from the protection of healthcare data to typing models in smartphones. Particularly in the healthcare context, it avoids the centralization of data and thus allows the data to remain with the federation client. This is especially helpful as provinces have different laws concerning the transport of data. 

There is one particular shortcoming to consider for federated learning. When training a model on a dataset, there are many times when the model can remember specific data examples. This is especially a problem with neural networks, wherein the sensitive data points can be retained by the model. The model can then be used to infer the data the model was trained on. Differential privacy is commonly used to remedy this situation.

## Differential Privacy
Differential privacy is a rigorous mathematical definition of privacy. It ensures against the inference of private information from the trained model. It relies on noise injection to ensure that an attacker cannot infer information about the victims of the attack. It ensures that an individual's data in a dataset cannot be obtained from the final model.
The formal definition of differential privacy is:

 <figure style="margin-bottom: 1em; margin-top: 1em;">
    <img src="/img/posts/dp-fl-experiments/differential-privacy.png"
    width="95%" style="margin: 10px 10px 10px 10px;">
    <figcaption>Figure 1: Definition of Differential Privacy</figcaption>
 </figure>

Note that the M here is the randomized algorithm. The **_&epsilon;_** is the measure of the maximum distance between one query on two different databases and the **_&delta;_** is the probability of information getting leaked. Also note that a smaller **_&epsilon;_** will yield better privacy results but the accuracy will in turn be lower. 

## Applying to Federated Learning
There are a few differential privacy algorithms considered when selecting an algorithm but few served our purpose since the bulk of differential privacy algorithms propose targeting the privacy of each member of the federation instead of targeting each data point in the dataset. This is done by injecting noise at the fl-server’s training level. This is ideal for many scenarios such as a federation of smartphones because there are millions of clients within the federation. However, this is not suitable for healthcare research as patient health information (PHI) is private and protected under acts such as the Personal Health Information Protection Act (PHIPA) in Ontario. Furthermore, it is crucial to inject noise at the fl-client-training level to ensure that the individual examples in a dataset are protected. 

The algorithm best served for our purposes would be Algorithm 4 (Figure 2) proposed by Nikolaos Tatarakis, in their thesis titled “[Differentially Private Federated Learning]”. This algorithm is based on two different algorithms. It combines an algorithm that computes the gradient of a specific example with the Federated Averaging algorithm. This gives rise to a comprehensive algorithm for differential privacy in federated learning.

 <figure style="margin-bottom: 1em; margin-top: 1em;">
    <img src="/img/posts/dp-fl-experiments/differential-privacy-algorithm.png"
    width="95%" style="margin: 10px 10px 10px 10px;">
    <figcaption>Figure 2: Algorithm 4: Tatarakis’s algorithm for End-to-End Differential Privacy in Federated Learning</figcaption>
 </figure>

Note that this algorithm modifies the Federated Averaging algorithm to compute the gradients at the example level. [Flower] (the federated learning framework we are using) does not currently support this algorithm. So, some of Flower’s classes (i.e.`FedAvg`, `Server` etc.) would require modification and might require the addition of supplemental child classes for this algorithm to be implemented. Ultimately, this was not the route taken due to time constraints.

## Choice of Differential Privacy Framework
There were three criterion considered when selecting a framework:
- It should be able to coexist with the current federated-learning architecture.
- Noise in the algorithm is added at the `fl-client`-training level instead of the `fl-server` level.
- A balance between accuracy and privacy loss should be achieved.

Moreover, many differential privacy frameworks explored were unmaintained, incomplete and written in a variety of different languages. Thus, Ali (a fellow co-op student) and I opted to use the open-source [diffprivlib] library provided by IBM instead. This library has extensive documentation and is well-maintained. It is also useful since `diffprivlib` inherits from Scikit-Learn, which allows for differential privacy to be easily implemented when running the model. It also offers a variety of different modules, such as `models`, `mechanisms`, `tools` and `accountant`. These modules are especially useful when building complex models.

## Differential Privacy on Synthea/CodeX Dataset
Implementing differential privacy on the already existing federated learning experiment on the Synthea dataset only required modification to the `model.py` file and adding the appropriate constants to the `settings.py` file. The other required files remained the same.
Differential privacy was added by using the `diffprivlib` library in the `model.py` file.
```python
model = dp.LogisticRegression(
   random_state=experiment.settings.FL_RANDOM_STATE,
   max_iter=experiment.settings.FL_EPOCHS,
   warm_start=True
)
```
This applies differential privacy on the client-side.

This model is then called in both the `server.py` and `client.py` files and the model’s parameters are initialized to zero using the `set_initial_params` method in the `Experiment` class. This is required by Flower as the parameters are uninitialized until model.fit is called.
 
It is then called in the `flower_client.py` file to fit the model to the data and initialize the Flower client. It is also used when performing client and server-side evaluation.

## Parameters of Differentially Private Logistic Regression Model
As in Scikit-Learn, many of the parameters for `diffprivlib`’s logistic regression model are already set. **_&epsilon;_** was the only default parameter modified to suit our needs. **_&epsilon;_** is the privacy budget/privacy loss and is set to 1 by default, as seen in the implementation of the [logistic regression model] by `diffprivlib`. After experimenting with different **_&epsilon;_** values, we settled on 0.85 as this allowed us to have similar accuracies as the federated experiment while also increasing the privacy. 


## Differentially Private vs Non-Differentially Private Federated Learning on Synthea Dataset
There was a slight decrease in accuracy between the federated logistic regression model and the differentially private federated logistic regression. This was expected as the injection of noise decreases the accuracy.

This difference might also be attributed to the differences between the implementation of logistic regression in Diffprivlib and Scikit-Learn. The only difference between the two experiments is the library chosen for the model.

The logistic regression model in diffprivlib implements regularized logistic regression using Scipy's [L-BFGS-B algorithm], thus the only solver we are allowed to use is ‘lbfgs’. While this is the default in Scikit-Learn as well, we chose to use the ‘saga’ solver as it is the preferred solver for sparse multinomial logistic regression. More discussion on logistic regression solvers can be found in this [stack-overflow discussion]. Thus, the use of a ‘lbfgs’ might have contributed to decreasing the accuracy slightly.

The multinomial logistic regression model was used on the Synthea/CodeX dataset since the target variable was the stage of a patient’s cancer, which ranges from 1 to 4. Given the target variable here was not binary, a regular logistic regression would not be suitable in this case. However, diffprivlib does not currently support multinomial logistic regression and instead defaults to using one-vs-rest logistic regression. Here, a multi-class classification is split into one binary classification problem per class instead of treating it as a multinomial classification. This might have also contributed to the decreased accuracy.

## Further Avenues of Exploration
As noted in the paragraph above, while `diffprivlib` attempts to emulate Scikit-Learn, it is not as expansive as Scikit-Learn. An alternative implementation to add differential privacy would be to use Flower and Opacus, further detailed in this [article]. This also has drawbacks as it uses Pytorch, which is a deep learning framework and not ideal for non-neural network models such as logistic regression. 

Using `diffprivlib` allows for the client-side application of differential privacy. This minimizes the impact that any particular data point would have on the analysis of the dataset as a whole, thereby ensuring the privacy of personal and sensitive information. 

However, there is no server-side differential privacy currently implemented. This means that it is possible to identify the client where the original data came from. This is not an urgent concern for our use case, as there are fewer federation clients containing many data points. 

Nevertheless, a custom differentially private algorithm can be added for future experiments by modifying the [`Strategy`] abstract base class in Flower. Since this class inherits from the `FedAvg` class, there are some parameters that need to be maintained in order to be compatible with the `fl-server`. These parameters are `on_fit_config_fn`, `eval_fn` and `min_available_clients`.


Do you have any questions? Feel free to contact us at [info@distributedgenomics.ca] or on Twitter at [@distribgenomics].

Reference Links
- [Docs folder in Federated Learning Repository]
- [Paper on Diffprivlib]
- [Diffprivlib documentation]
- Paper on [Differentially Private Federated Learning]
- [Differential privacy definitions]


<!-- links -->
[Flower]: https://flower.dev/
[diffprivlib]: https://github.com/IBM/differential-privacy-library
[logistic regression model]: https://github.com/IBM/differential-privacy-library/blob/main/diffprivlib/models/logistic_regression.py#L169
[L-BFGS-B algorithm]: (https://docs.scipy.org/doc/scipy/reference/optimize.minimize-lbfgsb.html#optimize-minimize-lbfgsb)
[stack-overflow discussion]: https://stackoverflow.com/questions/38640109/logistic-regression-python-solvers-definitions#:~:text=The%20SAGA%20solver%20is%20a,suitable%20for%20very%20Large%20dataset.
[article]: https://www.google.com/url?q=https://towardsdatascience.com/differentially-private-federated-learning-with-flower-and-opacus-e14fb0d2d229&sa=D&source=docs&ust=1650639970341133&usg=AOvVaw3KEfvgVBUGpz8aOtpdWtB6
[`Strategy`]: https://www.google.com/url?q=https://github.com/adap/flower/blob/main/src/py/flwr/server/strategy/strategy.py&sa=D&source=docs&ust=1650640128834176&usg=AOvVaw3t-E0Ya5YHnzJ_wPwMARdt
[Docs folder in Federated Learning Repository]: https://github.com/CanDIG/federated-learning/tree/AliRZ-02_Zamm178/DIG-824-Refactor-FL-Repo-for-DP/docs
[Paper on Diffprivlib]: https://arxiv.org/pdf/1907.02444.pdf
[Diffprivlib documentation]: https://diffprivlib.readthedocs.io/en/latest/modules/models.html
[Differentially Private Federated Learning]: http://kth.diva-portal.org/smash/get/diva2:1415980/FULLTEXT01.pdf
[Differential privacy definitions]: https://medium.com/@shaistha24/differential-privacy-definition-bbd638106242
[info@distributedgenomics.ca]: mailto:info@distributedgenomics.ca
[@distribgenomics]: https://twitter.com/distribgenomics
