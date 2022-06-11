# Dotnet Memory Expert Course

This is a summary of wonderful Konrad Kokosa series `.NET Memory Expert`:

<ul>
    {% for post in site.posts %}
        {% if post.path contains 'dotnet-memory-expert' && post.title != 'main.md' %}
            <li>
                <a href="{{ post.url }}">{{ post.title }}</a>
            </li>
        {% endif %}
    {% endfor %}  
</ul>