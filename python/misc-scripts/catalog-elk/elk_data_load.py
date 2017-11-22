import os
import time
from datetime import datetime
import argparse
from elasticsearch import Elasticsearch
import constants
from copy import deepcopy
import json

class ElkDataLoad(object):
    def __init__(self, es, index_name, file_path):
        self.es = es
        self.index_name = index_name
        self.filename = self.get_filename(file_path)
        self.file_path = file_path

    def get_filename(self, file_path):
        filename = file_path.split('/')[-1].split('.')[0]
        return self.get_proper_string(filename)

    def create_index_with_mapping(self, field_map):
        self.es.indices.create(
            index=self.index_name,
            body={
                'mappings': {
                    'test_collection': {
                        'properties': field_map
                    }
                }
            }
        )
        return 0

    def get_proper_string(self, string):
        final_string = ""
        exception_chars = set(['!','@','#','$','%',"'",'"','^','&','*','(',')','[',']',
            '{','}',';',':',',','/','<','>','?','\\','|','`','~','=','+'])
        included_chars = set([' ', '.', '-'])
        for e in string:
            if e not in exception_chars:
                if e in included_chars:
                    final_string += '_'
                else:
                    final_string += e
        return final_string

    def get_expected_types_dict(self, fields_arr):
        final_arr = []
        dict_ = {
            'integer': 0,
            'float': 0,
            'text': 0,
            'date': 0,
            'boolean': 0
        }
        for each_field in fields_arr:
            final_arr.append(deepcopy(dict_))
        return final_arr

    def convert_to_datatype(self, value, type_):
        if type_ == 'integer':
            return int(value)
        elif type_ == 'float':
            return float(value)
        elif type_ == 'text':
            return str(value)
        elif type_ == 'boolean':
            if value.lower() in set(['true', 'yes']):
                return True
            else:
                return False

    def get_datatype(self, value):
        try:
            float(value)
            if '.' in value:
                return 'float'
            else:
                return 'integer'
        except:
            if value.lower() in set(['true','false', 'yes', 'no']):
                return 'boolean'
            else:
                return 'text'
        return 'text'

    def get_high_rank_datatype(self, dict_):
        high_rank = ''
        highest = 0
        for k, v in dict_.iteritems():
            if highest <= v:
                highest = v
                high_rank = k
        return high_rank

    def get_fileds_and_field_to_datatype_map(self, lines_limit):
        count = 0
        field_to_datatype_map = {}
        with open(self.file_path, 'r') as f:
            first_line = f.readline()
            fields_arr = first_line.split(',')
            fields_arr = [self.get_proper_string(e) for e in fields_arr]
            fields_arr_len = len(fields_arr)
            field_to_datatypes_arr = self.get_expected_types_dict(fields_arr)
            for line in f:
                while count == lines_limit:
                    break
                line_arr = line.split(',')
                if fields_arr_len != len(line_arr):
                    continue
                for idx, val in enumerate(line_arr):
                    field_to_datatypes_arr[idx][self.get_datatype(val.strip())] += 1
                count += 1
        for i, field in enumerate(fields_arr):
            field_to_datatype_map[field] = {
                'type': self.get_high_rank_datatype(field_to_datatypes_arr[i])
            }
        return fields_arr, field_to_datatype_map

    def insert_data(self):
        fields_arr, field_to_datatype_map = self.get_fileds_and_field_to_datatype_map(100)
        print 'map', json.dumps(field_to_datatype_map)
        fields_arr_len = len(fields_arr)
        try:
            self.es.search(index=self.index_name)
        except:
            self.create_index_with_mapping(field_to_datatype_map)
        print 'Im done mapping'
        with open(self.file_path, 'r') as f:
            f.readline()
            for line in f:
                dict_ = {}
                line_arr = line.split(',')
                if fields_arr_len != len(line_arr):
                    continue
                try:
                    for idx, val in enumerate(line_arr):
                        field = fields_arr[idx]
                        dict_[field] = self.convert_to_datatype(val, field_to_datatype_map[field]['type'])
                    es.index(index=self.index_name, doc_type=self.filename, body=dict_)
                except Exception as e:
                    pass


if __name__ == '__main__':
    # parser = argparse.ArgumentParser(description='Specify group name')
    # parser.add_argument('-g', '--group', type=str, help='an integer for the accumulator')
    # args = vars(parser.parse_args())
    # group = args['group']
    es = Elasticsearch([constants.CONN_URL])
    index_name = 'data_catalog_test'
    elk_data_load = ElkDataLoad(es, index_name, constants.FILE_LOCATION)
    elk_data_load.insert_data()
    print 'hi'
