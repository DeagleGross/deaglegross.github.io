Welcome, my name is Dima, I am a .NET developer, and I always forget what I read about.  
Here is my storage of any CS related information. I am happy, if you also find it useful :)

<ul>
    {% for post in site.posts %}
        <li>
            <a href="{{ post.url }}">{{ post.title }}</a>
        </li>
    {% endfor %}  
</ul>