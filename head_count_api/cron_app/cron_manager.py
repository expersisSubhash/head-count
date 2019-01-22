from cron_app import (
    test,
    cron_send_emails
)


def execute_from_command_line(args):
    command_options = (
        (1, 'send_emails'),
    )

    command = 0
    try:
        ok_to_proceed = True
        # check length of arguments
        if not len(args) > 1:
            ok_to_proceed = False
            print("Wrong choice, Please enter the valid choice.")

        if ok_to_proceed:
            script, command = args
            # convert command value into integer
            try:
                command = int(command)
            except ValueError:
                ok_to_proceed = False
                print("Value must be number.")

        if ok_to_proceed:
            cmd_options = dict(command_options)

            if command in cmd_options and command == 1:
                cron_send_emails.main()
            else:
                test.main()
    except:
       pass
