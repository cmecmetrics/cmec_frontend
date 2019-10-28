import json
import pandas as pd

# package for flattening json in pandas df
from pandas.io.json import json_normalize


MODEL_NAMES = [
    "bcc-csm1-1",
    "bcc-csm1-1-m",
    "CESM1-BGC",
    "GFDL-ESM2G",
    "inmcm4",
    "IPSL-CM5A-LR",
    "MIROC-ESM",
    "MPI-ESM-LR",
    "NorESM1-ME",
    "MeanCMIP5",
    "BCC-CSM2-MR",
    "BCC-ESM1",
    "CESM2",
    "CESM2-WACCM",
    "CNRM-CM6-1",
    "CNRM-ESM2-1",
    "E3SMv1-CTC",
    "GISS-E2-1-G",
    "GISS-E2-1-H",
    "IPSL-CM6A-LR",
    "MIROC6",
    "MRI-ESM2-0",
    "MeanCMIP6",
]


def load_json_data():
    # load json object
    with open("test.json") as scalar_json:
        scalar_data = json.load(scalar_json)
    return scalar_data


def refector_json(scalar_data):
    metric_catalogues = scalar_data.keys()
    metric_catalogues_list = list(metric_catalogues)
    regions = set(
        [
            x.split()[-1]
            for x in scalar_data[metric_catalogues_list[0]].keys()
            if x != "children"
        ]
    )

    obj = {}
    for region in regions:
        obj[region] = {}
        for catalogue in metric_catalogues:
            obj[region][catalogue] = {}
            for index, model in enumerate(MODEL_NAMES):
                obj[region][catalogue][model] = {}
                for k, v in {
                    key.rsplit(" ", 1)[0]: value
                    for (key, value) in scalar_data[catalogue].items()
                    if key != "children" and region in key
                }.items():
                    # print('k:', k)
                    # print('v:', v)
                    obj[region][catalogue][model][k] = v[index]
                metrics = scalar_data[catalogue]["children"]
                metrics_obj = {}
                if metrics:
                    for metric, metric_value in metrics.items():
                        foo = {
                            key.rsplit(" ", 1)[0]: value[index]
                            for (key, value) in metric_value.items()
                            if key != "children" and region in key
                        }
                        print("foo:", foo)
                        obj[region][catalogue][model][metric] = foo
                        observational_products = metric_value["children"]
                        if observational_products:
                            products_obj = {}
                            for (
                                observation,
                                observation_value,
                            ) in observational_products.items():
                                print("observation:", observation)
                                product = {
                                    key.rsplit(" ", 1)[0]: value[index]
                                    for (key, value) in observation_value.items()
                                    if key != "children" and region in key
                                }
                                print("product:", product)
                                # return
                                obj[region][catalogue][model][metric][
                                    observation
                                ] = product

    # print('obj:', obj)
    return obj


def reformat_json(scalar_data):
    metric_catalogues = scalar_data.keys()
    metric_catalogues_list = list(metric_catalogues)
    regions = set(
        [
            x.split()[-1]
            for x in scalar_data[metric_catalogues_list[0]].keys()
            if x != "children"
        ]
    )

    obj = {}
    for region in regions:
        obj[region] = {}
        for catalogue in metric_catalogues:
            score_dict = {
                key.rsplit(" ", 1)[0]: value
                for (key, value) in scalar_data[catalogue].items()
                if key != "children" and region in key
            }
            for score, values in score_dict.items():
                score_dict[score] = {
                    key: value for (key, value) in zip(MODEL_NAMES, values)
                }
            metrics = scalar_data[catalogue]["children"]
            metrics_obj = {}
            if metrics:
                for metric, value in metrics.items():
                    metric_score_dict = {
                        key.rsplit(" ", 1)[0]: value
                        for (key, value) in value.items()
                        if key != "children" and region in key
                    }
                    for score, values in metric_score_dict.items():
                        metric_score_dict[score] = {
                            key: value for (key, value) in zip(MODEL_NAMES, values)
                        }
                    metrics_obj[metric] = {"scores": metric_score_dict}
                    observational_products = value["children"]
                    if observational_products:
                        products_obj = {}
                        for product, product_value in observational_products.items():
                            product_score_dict = {
                                key.rsplit(" ", 1)[0]: value
                                for (key, value) in product_value.items()
                                if key != "children" and region in key
                            }
                            for score, values in product_score_dict.items():
                                product_score_dict[score] = {
                                    key: value
                                    for (key, value) in zip(MODEL_NAMES, values)
                                }
                            products_obj[product] = {"scores": product_score_dict}
                    metrics_obj[metric]["observational_products"] = products_obj
            obj[region][catalogue] = {"scores": score_dict, "metrics": metrics_obj}
    return obj


def write_json_file(obj):
    with open("data_file.json", "w") as write_file:
        json.dump(obj, write_file)


def main():
    scalar_data = load_json_data()
    obj = reformat_json(scalar_data)
    write_json_file(obj)


def extract_values(obj, key):
    """Recursively pull values of specified key from nested JSON."""
    arr = []

    def extract(obj, arr, key):
        """Return all matching values in an object."""
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, (dict, list)):
                    extract(v, arr, key)
                elif k == key:
                    arr.append({k: v})
        elif isinstance(obj, list):
            for item in obj:
                extract(item, arr, key)
        return arr

    results = extract(obj, arr, key)
    return results


def get_all_scores_for_model_by_region(model, region):
    # load json object
    with open("data_file.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    output = {}
    metric_catalogue = scalar_data[region]
    for catalogue in metric_catalogue:
        output[catalogue] = {}
        scores_obj = {}
        scores = scalar_data[region][catalogue]["scores"]
        for key, value in scores.items():
            scores_obj[key] = {model: value[model]}
        output[catalogue]["scores"] = scores_obj
        metrics = scalar_data[region][catalogue]["metrics"]
        metrics_obj = {}
        if metrics:
            for metric, value in metrics.items():
                metrics_obj[metric] = {}
                metrics_scores_obj = {}
                for score, score_value in value["scores"].items():
                    metrics_scores_obj[score] = {model: score_value[model]}
                    # metrics_obj[metric][score] = {model: score_value[model]}
                metrics_obj[metric]["scores"] = metrics_scores_obj
            output[catalogue]["metrics"] = metrics_obj

    with open("ALL_SCORES_{}_{}.json".format(model, region), "w") as write_file:
        json.dump(output, write_file)


def get_catalogue_for_all_regions(metric_catalogue):
    # load json object
    with open("data_file.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    regions = scalar_data.keys()

    output = {}

    for region in regions:
        output[region] = scalar_data[region][metric_catalogue]

    with open("ALL_REGIONS_{}.json".format(metric_catalogue), "w") as write_file:
        json.dump(output, write_file)


def metric_scalar_hyperslab(metric_name, scalar_name):
    with open("paul_format.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    regions = scalar_data["RESULTS"].keys()
    for region in regions:
        scalar_data["RESULTS"][region] = {
            metric: scalar_data["RESULTS"][region][metric]
            for metric in scalar_data["RESULTS"][region].keys()
            if metric_name in metric
        }
        metrics = scalar_data["RESULTS"][region].keys()
        for metric in metrics:
            try:
                scalar_dict = scalar_data["RESULTS"][region][metric][scalar_name]
            except KeyError:
                scalar_dict = {}
            scalar_data["RESULTS"][region][metric] = {scalar_name: scalar_dict}
    with open(
        "{}_metric_{}_scalar_hyperslab.json".format(metric_name, scalar_name), "w"
    ) as write_file:
        json.dump(scalar_data, write_file, sort_keys=True)


def metric_model_hyperslab(metric_name, model_name):
    with open("paul_format.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    regions = scalar_data["RESULTS"].keys()
    for region in regions:
        scalar_data["RESULTS"][region] = {
            metric: scalar_data["RESULTS"][region][metric]
            for metric in scalar_data["RESULTS"][region].keys()
            if metric_name in metric
        }
        metrics = scalar_data["RESULTS"][region].keys()
        for metric in metrics:
            print("metrics:", metrics)
            scalars = scalar_data["RESULTS"][region][metric].keys()
            print("scalars:", scalars)
            for scalar in scalars:
                try:
                    old_dict = {
                        model_name: scalar_data["RESULTS"][region][metric][scalar][
                            model_name
                        ]
                    }
                except KeyError:
                    old_dict = {model_name: -999}

                scalar_data["RESULTS"][region][metric][scalar] = {
                    model_name: old_dict[model_name]
                }

    with open(
        "{}_metric_{}_model_hyperslab.json".format(metric_name, model_name), "w"
    ) as write_file:
        json.dump(scalar_data, write_file, sort_keys=True)


def scalar_model_hyperslab(scalar_name, model_name):
    with open("paul_format.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    regions = scalar_data["RESULTS"].keys()
    for region in regions:
        metrics = scalar_data["RESULTS"][region].keys()
        for metric in metrics:
            try:
                old_dict = scalar_data["RESULTS"][region][metric][scalar_name]
            except KeyError:
                old_dict = {model_name: -999}

            scalar_data["RESULTS"][region][metric] = {
                scalar_name: {model_name: old_dict[model_name]}
            }

    with open(
        "{}_scalar_{}_model_hyperslab.json".format(scalar_name, model_name), "w"
    ) as write_file:
        json.dump(scalar_data, write_file, sort_keys=True)


def paul_format(scalar_data):
    output = {}

    output["DIMENSIONS"] = {
        "json_structure": ["region", "metric", "statistic", "model"]
    }
    output["RESULTS"] = {}

    metric_catalogues = scalar_data.keys()
    metric_catalogues_list = list(metric_catalogues)
    regions = set(
        [
            x.split()[-1]
            for x in scalar_data[metric_catalogues_list[0]].keys()
            if x != "children"
        ]
    )

    obj = {}
    for region in regions:
        obj[region] = {}
        print("region:", region)
        for catalogue in metric_catalogues:
            print("catalogue:", catalogue)
            score_dict = {
                key.rsplit(" ", 1)[0]: value
                for (key, value) in scalar_data[catalogue].items()
                if key != "children" and region in key
            }
            for score, values in score_dict.items():
                score_dict[score] = {
                    key: value for (key, value) in zip(MODEL_NAMES, values)
                }
            # print("score_dict:", score_dict)
            obj[region][catalogue] = score_dict
            metrics = scalar_data[catalogue]["children"]
            if metrics:
                for metric, value in metrics.items():
                    print("metric:", metric)
                    metric_score_dict = {
                        key.rsplit(" ", 1)[0]: value
                        for (key, value) in value.items()
                        if key != "children" and region in key
                    }
                    for score, values in metric_score_dict.items():
                        metric_score_dict[score] = {
                            key: value for (key, value) in zip(MODEL_NAMES, values)
                        }
                    # print("metric_score_dict:", metric_score_dict)
                    obj[region]["{}::{}".format(catalogue, metric)] = metric_score_dict
                    observational_products = value["children"]
                    if observational_products:
                        for product, product_value in observational_products.items():
                            product_score_dict = {
                                key.rsplit(" ", 1)[0]: value
                                for (key, value) in product_value.items()
                                if key != "children" and region in key
                            }
                            for score, values in product_score_dict.items():
                                product_score_dict[score] = {
                                    key: value
                                    for (key, value) in zip(MODEL_NAMES, values)
                                }
                            # print("product:", product)
                            # print("product_score_dict:", product_score_dict)
                            obj[region][
                                "{}::{}::{}".format(catalogue, metric, product)
                            ] = product_score_dict

    output["RESULTS"] = obj

    with open("paul_format.json", "w") as write_file:
        json.dump(output, write_file, sort_keys=True)


def extract_scalar(options_array, write_file=False):
    with open("paul_format.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    try:
        output = scalar_data["RESULTS"][options_array[0]][options_array[1]][
            options_array[2]
        ][options_array[3]]
    except KeyError:
        output = -999

    scalar_data["RESULTS"] = {
        options_array[0]: {
            options_array[1]: {options_array[2]: {options_array[3]: output}}
        }
    }

    if write_file:
        with open(
            "{}_{}_{}_{}_scalar.json".format(
                options_array[0], options_array[1], options_array[2], options_array[3]
            ),
            "w",
        ) as write_file:
            json.dump(scalar_data, write_file, sort_keys=True)

    return {options_array[3]: output}


def extract_one_dimension(options_array):
    with open("paul_format.json") as scalar_json:
        scalar_data = json.load(scalar_json)

    json_structure = scalar_data["DIMENSIONS"]["json_structure"]

    options = dict(zip(json_structure, options_array))

    print("options:", options)

    if options_array[0] == ":":
        keys = scalar_data["RESULTS"].keys()
        for key in keys:
            metrics = [
                metric_name
                for metric_name in scalar_data["RESULTS"][key].keys()
                if options_array[1] in metric_name
            ]
            for metric in metrics:
                scalar_data["RESULTS"][key][metric] = {}
                scalar_data["RESULTS"][key][metric] = {
                    options_array[2]: extract_scalar(
                        [key, metric, options_array[2], options_array[3]]
                    )
                }
        file_name = "{}_{}_{}_{}_scalar.json".format(
            "all", options_array[1], options_array[2], options_array[3]
        )
    if options_array[1] == ":":
        keys = scalar_data["RESULTS"][options_array[0]].keys()
        scalar_data["RESULTS"] = {options_array[0]: {}}
        for key in keys:
            scalar_data["RESULTS"][options_array[0]][key] = {
                options_array[2]: extract_scalar(
                    [options_array[0], key, options_array[2], options_array[3]]
                )
            }
        file_name = "{}_{}_{}_{}_scalar.json".format(
            options_array[0], "all", options_array[2], options_array[3]
        )

    if options_array[2] == ":":
        keys = scalar_data["RESULTS"][options_array[0]][options_array[1]].keys()
        metrics = [
            metric_name
            for metric_name in scalar_data["RESULTS"][options_array[0]].keys()
            if options_array[1] in metric_name
        ]
        scalar_data["RESULTS"] = {options_array[0]: {}}
        for metric in metrics:
            scalar_data["RESULTS"][options_array[0]][metric] = {}
            for key in keys:
                scalar_data["RESULTS"][options_array[0]][metric][key] = extract_scalar(
                    [
                        options_array[0],
                        options_array[1],
                        key,
                        options_array[3],
                    ]  # TODO: might have to change options_array[1] to metric because of loop
                )

        file_name = "{}_{}_{}_{}_scalar.json".format(
            options_array[0], options_array[1], "all", options_array[3]
        )
    if options_array[3] == ":":
        temp = {options_array[0]: {}}
        metrics = [
            metric_name
            for metric_name in scalar_data["RESULTS"][options_array[0]].keys()
            if options_array[1] in metric_name
        ]
        # scalar_data["RESULTS"] = {options_array[0]: {}}
        for metric in metrics:
            try:
                keys = scalar_data["RESULTS"][options_array[0]][metric][
                    options_array[2]
                ].keys()
            except KeyError:
                keys = []
            print("keys:", keys)
            temp[options_array[0]][metric] = {}
            for key in keys:
                temp[options_array[0]][metric][key] = extract_scalar(
                    [options_array[0], metric, options_array[2], key]
                ).get(key)
        scalar_data["RESULTS"] = temp
        file_name = "{}_{}_{}_{}_scalar.json".format(
            options_array[0], options_array[1], options_array[2], "all"
        )
    # if options_array[1] == ":":
    #     options_array[1] = scalar_data["RESULTS"][options_array[0]].keys()

    with open(file_name, "w") as write_file:
        json.dump(scalar_data, write_file, sort_keys=True)


if __name__ == "__main__":
    # main()
    # get_catalogue_for_all_regions("Ecosystem and Carbon Cycle")
    # get_all_scores_for_model_by_region("bcc-csm1-1", "southamericaamazon")
    # with open("test.json") as scalar_json:
    #     scalar_data = json.load(scalar_json)

    # paul_format(scalar_data)
    # with open('test.json') as scalar_json:
    #     scalar_data = json.load(scalar_json)

    # test = refector_json(scalar_data)

    # with open("REGIONS_BY_MODEL_3.json", "w") as write_file:
    #     json.dump(test, write_file)

    # values = extract_values(scalar_data, "inmcm4")
    # print(len(values))
    # print("values:", values)

    # scalar_model_hyperslab("Bias Score", "BCC-CSM2-MR")
    # metric_model_hyperslab("Ecosystem and Carbon Cycle", "BCC-CSM2-MR")
    # metric_scalar_hyperslab("Ecosystem and Carbon Cycle", "Bias Score")
    # extract_scalar(
    #     ["global", "Ecosystem and Carbon Cycle", "Bias Score", "BCC-CSM2-MR"]
    # )

    # TODO: Change wildcard character to *
    # extract_one_dimension(
    #     [":", "Ecosystem and Carbon Cycle", "Bias Score", "BCC-CSM2-MR"]
    # )
    # extract_one_dimension(["global", ":", "Bias Score", "BCC-CSM2-MR"])
    # extract_one_dimension(["global", "Ecosystem and Carbon Cycle", ":", "BCC-CSM2-MR"])
    extract_one_dimension(["global", "Ecosystem and Carbon Cycle", "Bias Score", ":"])

