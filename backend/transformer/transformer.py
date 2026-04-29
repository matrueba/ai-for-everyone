import torch
import torch.nn as nn
from .encoder import EncoderLayer
from .decoder import DecoderLayer
import math


class Transformer(nn.Module):
    def __init__(self, src_vocab_size, tgt_vocab_size, d_model, num_heads, num_layers, d_ff, max_seq_length, dropout):
        super(Transformer, self).__init__()
        self.encoder_embedding = nn.Embedding(src_vocab_size, d_model)
        self.decoder_embedding = nn.Embedding(tgt_vocab_size, d_model)
        self.positional_encoding = self.create_positional_encoding(max_seq_length, d_model)
        
        self.encoder_layers = nn.ModuleList([EncoderLayer(d_model, num_heads, d_ff, dropout) for _ in range(num_layers)])
        self.decoder_layers = nn.ModuleList([DecoderLayer(d_model, num_heads, d_ff, dropout) for _ in range(num_layers)])
        
        self.fc = nn.Linear(d_model, tgt_vocab_size)
        self.dropout = nn.Dropout(dropout)
        
    def create_positional_encoding(self, max_seq_length, d_model):
        position = torch.arange(max_seq_length).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2) * -(math.log(10000.0) / d_model))
        pos_encoding = torch.zeros(max_seq_length, d_model)
        pos_encoding[:, 0::2] = torch.sin(position * div_term)
        pos_encoding[:, 1::2] = torch.cos(position * div_term)
        return pos_encoding.unsqueeze(0)
        
    def forward(self, src, tgt, src_mask, tgt_mask):
        src_embedded = self.dropout(self.encoder_embedding(src) + self.positional_encoding[:, :src.size(1), :])
        tgt_embedded = self.dropout(self.decoder_embedding(tgt) + self.positional_encoding[:, :tgt.size(1), :])
        
        enc_output = src_embedded
        attentions = []
        for enc_layer in self.encoder_layers:
            enc_output, attn, Q, K, V, attn_scores = enc_layer(enc_output, src_mask)
            attentions.append({
                'attn': attn,
                'queries': Q,
                'keys': K,
                'values': V,
                'attn_scores': attn_scores
            })
        
        dec_output = tgt_embedded
        for dec_layer in self.decoder_layers:
            dec_output, self_attn, self_Q, self_K, self_V, self_attn_scores, cross_attn, cross_Q, cross_K, cross_V, cross_attn_scores = dec_layer(dec_output, enc_output, src_mask, tgt_mask)
        
        logits = self.fc(dec_output)
        return logits, attentions, self_attn, self_Q, self_K, self_V, self_attn_scores, cross_attn, cross_Q, cross_K, cross_V, cross_attn_scores