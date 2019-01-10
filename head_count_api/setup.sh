#!/bin/sh

# alias python=python3.6

# Initial django migration
echo ""
echo "------------------------------------------------------------"
echo "Initial Django migration"
echo ""

python manage.py migrate

rm terragraph_phy_test/admin.pyc
rm terragraph_phy_test/models.pyc


# Create superuser
echo ""
echo "------------------------------------------------------------"
echo "Creating superuser"
echo ""
python createsuperuser.py

# Create initial users
echo ""
echo "------------------------------------------------------------"
echo "Creating initial users"
echo ""
python createinitialusers.py

# Load initial data
echo ""
echo "------------------------------------------------------------"
echo "Loading initial data"
echo ""

# run collectstatic
python manage.py collectstatic --no-input

echo ""
echo "------------------------------------------------------------"
echo "All Done!"
echo "------------------------------------------------------------"
echo ""
