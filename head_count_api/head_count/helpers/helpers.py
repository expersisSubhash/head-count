def get_custom_error_list(errors, custom_error_list=None):
    if not custom_error_list:
        custom_error_list = []
    if isinstance(errors, dict):
        for key, val in errors.items():
            if isinstance(val, dict):
                custom_error_list = get_custom_error_list(val, custom_error_list)
            elif isinstance(val, list):
                for item in val:
                    if isinstance(item, dict):
                        custom_error_list = get_custom_error_list(item, custom_error_list)
                    else:
                        if key != 'non_field_errors':
                            title = str(key).capitalize()
                            msg = title + ': ' + item
                        else:
                            msg = item
                        custom_error_list.append(msg)
            else:
                if key != 'non_field_errors':
                    title = str(key).capitalize()
                    msg = title + ': ' + val
                else:
                    msg = val
                custom_error_list.append(msg)
    return custom_error_list