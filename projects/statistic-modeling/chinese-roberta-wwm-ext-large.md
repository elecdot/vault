---
tags:
  - concept
  - model
  - nlp
  - bert
  - ml
kind: concept
format: card
status: fleeting
source:
  - "[GitHub Repo](https://github.com/ymcui/Chinese-BERT-wwm?tab=readme-ov-file)"
  - "[Hugging Face](https://huggingface.co/hfl/chinese-roberta-wwm-ext-large)"
  - "[Arxiv abs](https://arxiv.org/abs/1906.08101)"
project: "[[statistic-modeling]]"
aliases:
  - Chinese RoBERTa WWWM Ext Large
  - Chinese RoBERTa-wwm-ext-large
  - RoBERTa-wwm-ext-large
---

# Chinese RoBERTa WWWM Ext Large

```python
# Use a pipeline as a high-level helper
from transformers import pipeline

pipe = pipeline("fill-mask", model="hfl/chinese-roberta-wwm-ext-large")
```
```python
# Load model directly
from transformers import AutoTokenizer, AutoModelForMaskedLM

tokenizer = AutoTokenizer.from_pretrained("hfl/chinese-roberta-wwm-ext-large")
model = AutoModelForMaskedLM.from_pretrained("hfl/chinese-roberta-wwm-ext-large")
```

>[!todo] Maybe try [[mlm-as-correction-bert|MacBERT]] because in [[cui-2021-pre-training-with-whole-word-masking-for-chinese-bert.pdf#page=8]], the model which authors introduced (MacBERT) reach the SOTA of sentence pair classification task.

## Core Idea
Basically a Chinese pre-trained version `RoBERTa-wwm-ext-large`. See the sources above.

## Related
- none

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
