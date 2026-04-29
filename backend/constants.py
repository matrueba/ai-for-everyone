VOCAB_FILES_NAMES = {
    'vocab_file': 'vocab.json',
    'merges_file': 'merges.txt',
}

PRETRAINED_VOCAB_FILES_MAP = {
    'vocab_file':
    {
        'gpt2': "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-vocab.json",
        'gpt2-medium': "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-medium-vocab.json",
    },
    'merges_file':
    {
        'gpt2': "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-merges.txt",
        'gpt2-medium': "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-medium-merges.txt",
    },
}

GPT2_PRETRAINED_MODEL_ARCHIVE_MAP = {"gpt2": "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-pytorch_model.bin",
                                     "gpt2-medium": "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-medium-pytorch_model.bin"}
GPT2_PRETRAINED_CONFIG_ARCHIVE_MAP = {"gpt2": "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-config.json",
                                      "gpt2-medium": "https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-medium-config.json"}
