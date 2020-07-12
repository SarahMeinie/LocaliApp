from django.apps import apps

def insertData(apps, schema_editor):
    record_to_insert = [("Emergency", "danger"), ("Alert", "alert"), ("Warning", "warning"), ("Notice", "secondary"), ("Event", "primary"), ("Market", "success"), ("Meeting", "success"), ("Sport", "tertiary"), ("Party", "purple"), ("Pets", "tertiary"), ("Food", "success"), ("Missing", "danger"), ("Found", "tertiary"), ("Sales", "tertairy"), ("Auction", "tertiary"), ("Jobs", "warning"), ("Second-Hand", "secondary"), ("Covid-19", "danger"), ("Weather", "success"), ("Robbery", "danger"), ("Load Shedding", "warning"), ("Power Outage", "warning"), ("Pothole", "alert"), ("Roadworks", "alert"), ("Traffic", "alert"), ("Accident", "alert"), ("Noise", "purple")]

    Cat = apps.get_model('Posts', 'Categories')
    for category in record_to_insert:
        new_category = Cat(colour = category[0], tag = category[1])
        new_category.save()

migrations.RunPython(insertData),