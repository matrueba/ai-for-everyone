from collections import defaultdict
from typing import Optional
import torch



def format_special_chars(tokens):
    return [t.replace("Ġ", " ").replace("▁", " ") for t in tokens]


def get_attention_data(model, tokenizer, sentence_a: str, sentence_b: Optional[str] = None):
    """
    Run the model on the input text and return attention / query / key data
    structured identically to the old IPython `get_attention` function.
    """
    if not sentence_a:
        raise ValueError("sentence_a is required")

    is_pair = bool(sentence_b)

    # The positional encoding table caps the sequence length, so truncate to it
    max_length = model.positional_encoding.size(1)

    # Tokenize
    if is_pair:
        encoded = tokenizer(sentence_a, sentence_b, return_tensors="pt", truncation=True, max_length=max_length)
        tokens_tensor = encoded["input_ids"]
        tokens = tokenizer.convert_ids_to_tokens(tokens_tensor[0].tolist())
        type_ids = encoded["token_type_ids"][0].tolist()
        tokens_a = [tok for tok, type_id in zip(tokens, type_ids) if type_id == 0]
        tokens_b = [tok for tok, type_id in zip(tokens, type_ids) if type_id == 1]
    else:
        tokens_tensor = tokenizer(sentence_a, return_tensors="pt", truncation=True, max_length=max_length)["input_ids"]
        tokens_a = tokenizer.convert_ids_to_tokens(tokens_tensor[0].tolist())
        tokens_b = None

    # Forward pass
    with torch.no_grad():
        output = model(tokens_tensor, tokens_tensor, None, None)

    # In Transformer.forward: return logits, attentions, self_attn, ...
    # Index 1 is the list of attention dictionaries from the encoder layers
    if isinstance(output, (list, tuple)) and len(output) > 1:
        attn_data_list = output[1]
    else:
        attn_data_list = []

    # Build dicts
    attn_dict = defaultdict(list)
    queries_dict = defaultdict(list)
    keys_dict = defaultdict(list)
    values_dict = defaultdict(list)


    if is_pair:
        slice_a = slice(0, len(tokens_a))
        slice_b = slice(len(tokens_a), len(tokens_a) + len(tokens_b))

    for layer, attn_data in enumerate(attn_data_list):
        if isinstance(attn_data, dict):
            attn = attn_data["attn"][0]
        else:
            attn = attn_data[0]

        attn_dict["all"].append(attn.tolist())

        if is_pair:
            attn_dict["aa"].append(attn[:, slice_a, slice_a].tolist())
            attn_dict["bb"].append(attn[:, slice_b, slice_b].tolist())
            attn_dict["ab"].append(attn[:, slice_a, slice_b].tolist())
            attn_dict["ba"].append(attn[:, slice_b, slice_a].tolist())

        if isinstance(attn_data, dict):
            queries = attn_data.get("queries")
            keys = attn_data.get("keys")
            values = attn_data.get("values")
            if queries is not None:
                queries = queries[0]
                queries_dict["all"].append(queries.tolist())
                if is_pair:
                    queries_dict["a"].append(queries[:, slice_a, :].tolist())
                    queries_dict["b"].append(queries[:, slice_b, :].tolist())
            if keys is not None:
                keys = keys[0]
                keys_dict["all"].append(keys.tolist())
                if is_pair:
                    keys_dict["a"].append(keys[:, slice_a, :].tolist())
                    keys_dict["b"].append(keys[:, slice_b, :].tolist())
            if values is not None:
                values = values[0]
                values_dict["all"].append(values.tolist())
                if is_pair:
                    values_dict["a"].append(values[:, slice_a, :].tolist())
                    values_dict["b"].append(values[:, slice_b, :].tolist())

    tokens_a = format_special_chars(tokens_a)
    if tokens_b:
        tokens_b = format_special_chars(tokens_b)

    results = {
        "all": {
            "attn": attn_dict["all"],
            "left_text": tokens_a + (tokens_b if tokens_b else []),
            "right_text": tokens_a + (tokens_b if tokens_b else []),
            "queries": queries_dict["all"],
            "keys": keys_dict["all"],
            "values": values_dict["all"],

        }
    }

    if is_pair:
        results.update({
            "aa": {
                "attn": attn_dict["aa"],
                "left_text": tokens_a,
                "right_text": tokens_a,
                "queries": queries_dict["a"],
                "keys": keys_dict["a"],
                "values": values_dict["a"],
            },
            "bb": {
                "attn": attn_dict["bb"],
                "left_text": tokens_b,
                "right_text": tokens_b,
                "queries": queries_dict["b"],
                "keys": keys_dict["b"],
                "values": values_dict["b"],
            },
            "ab": {
                "attn": attn_dict["ab"],
                "left_text": tokens_a,
                "right_text": tokens_b,
                "queries": queries_dict["a"],
                "keys": keys_dict["b"],
                "values": values_dict["b"],
            },
            "ba": {
                "attn": attn_dict["ba"],
                "left_text": tokens_b,
                "right_text": tokens_a,
                "queries": queries_dict["b"],
                "keys": keys_dict["a"],
                "values": values_dict["a"],
            },
        })

    return results
